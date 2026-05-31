from rest_framework import viewsets, permissions, exceptions
from .models import Company, Department, Employee
from .serializers import CompanySerializer, DepartmentSerializer, EmployeeSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        profile = getattr(user, "employee_profile", None)
        token["role"] = profile.role if profile else "ADMIN"
        token["email"] = user.email
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If they are a superuser/admin, show them ALL companies
        if user.is_staff:
            return Company.objects.all()

        # Otherwise, only show them the company they belong to
        if hasattr(user, "employee_profile") and user.employee_profile.company:
            return Company.objects.filter(id=user.employee_profile.company.id)

        return Company.objects.none()  # Failsafe: return nothing

    def check_permissions(self, request):
        super().check_permissions(request)
        profile = getattr(request.user, "employee_profile", None)

        # Block HR and standard employees from creating/deleting companies
        if request.method in ["POST", "DELETE"] and profile and profile.role != "ADMIN":
            raise exceptions.PermissionDenied(
                "Only System Administrators can create or delete companies."
            )


class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 1. If they are an Admin, show them ALL departments
        if user.is_staff:
            return Department.objects.all()

        # 2. If they are a standard employee or HR, only show departments inside THEIR company
        if hasattr(user, "employee_profile") and user.employee_profile.company:
            return Department.objects.filter(company=user.employee_profile.company)

        # 3. Failsafe: Return nothing
        return Department.objects.none()

    def check_permissions(self, request):
        super().check_permissions(request)
        profile = getattr(request.user, "employee_profile", None)

        # Block standard employees from doing anything except viewing (GET)
        if (
            request.method not in permissions.SAFE_METHODS
            and profile
            and profile.role == "EMPLOYEE"
        ):
            raise exceptions.PermissionDenied("Employees cannot modify departments.")

    def perform_create(self, serializer):
        user = self.request.user
        profile = getattr(user, "employee_profile", None)

        # Enforce HR boundary: HR Managers can only create departments in their own company
        if profile and profile.role == "HR":
            requested_company = serializer.validated_data.get("company")
            if requested_company != profile.company:
                raise exceptions.PermissionDenied(
                    "HR Managers can only create departments for their assigned company."
                )

        serializer.save()


class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Employee.objects.all()

        if hasattr(user, "employee_profile") and user.employee_profile.company:
            return Employee.objects.filter(company=user.employee_profile.company)

        return Employee.objects.none()

    def check_permissions(self, request):
        super().check_permissions(request)
        profile = getattr(request.user, "employee_profile", None)

        # Block standard employees from doing anything except viewing (GET)
        if (
            request.method not in permissions.SAFE_METHODS
            and profile
            and profile.role == "EMPLOYEE"
        ):
            raise exceptions.PermissionDenied("Employees cannot modify records.")

    def perform_create(self, serializer):
        user = self.request.user
        profile = getattr(user, "employee_profile", None)

        company = serializer.validated_data.get("company")
        department = serializer.validated_data.get("department")

        # 1. Enforce HR Boundary
        if profile and profile.role == "HR":
            if company != profile.company:
                raise exceptions.PermissionDenied(
                    "HR Managers can only onboard employees for their assigned company."
                )

        # 2. Structural Validation
        if department and department.company != company:
            raise exceptions.ValidationError(
                {
                    "department": "This department does not belong to the selected company."
                }
            )

        serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        profile = getattr(user, "employee_profile", None)

        company = serializer.validated_data.get("company", serializer.instance.company)
        department = serializer.validated_data.get(
            "department", serializer.instance.department
        )

        # 1. Enforce HR Boundary
        if profile and profile.role == "HR":
            if company != profile.company:
                raise exceptions.PermissionDenied(
                    "HR Managers cannot transfer employees to outside companies."
                )

        # 2. Structural Validation
        if department and department.company != company:
            raise exceptions.ValidationError(
                {
                    "department": "This department does not belong to the selected company."
                }
            )

        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        profile = getattr(user, "employee_profile", None)

        # Security Lock: Prevent users from deleting their own account
        if profile and instance.id == profile.id:
            raise exceptions.PermissionDenied(
                "Action blocked: You cannot delete your own employee record."
            )

        instance.delete()
