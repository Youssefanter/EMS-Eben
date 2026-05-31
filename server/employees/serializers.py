from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, Department, Employee


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class CompanySerializer(serializers.ModelSerializer):
    departments_count = serializers.SerializerMethodField()
    employees_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "address",
            "created_at",
            "departments_count",
            "employees_count",
        ]

    def get_departments_count(self, obj):
        return Department.objects.filter(company=obj).count()

    def get_employees_count(self, obj):
        return Employee.objects.filter(company=obj).count()


class DepartmentSerializer(serializers.ModelSerializer):
    active_employee_count = serializers.ReadOnlyField()
    company_name = serializers.ReadOnlyField(source="company.name")

    class Meta:
        model = Department
        fields = [
            "id",
            "name",
            "company",
            "company_name",
            "created_at",
            "active_employee_count",
        ]


class EmployeeSerializer(serializers.ModelSerializer):
    from rest_framework import serializers


from django.contrib.auth.models import User
from .models import Employee, Company, Department


class EmployeeSerializer(serializers.ModelSerializer):
    # 1. Login fields (Write Only)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    full_name = serializers.SerializerMethodField()
    company_name = serializers.CharField(source="company.name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "user",
            "company",
            "department",
            "role",
            "mobile",
            "title",
            "hire_date",
            "is_active_status",
            "address",
            "username",
            "password",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "company_name",
            "department_name",
            "user_email",
        ]
        read_only_fields = ["user"]

    def get_full_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return "Unknown Employee"

    def create(self, validated_data):
        username = validated_data.pop("username")
        password = validated_data.pop("password")
        email = validated_data.pop("email")
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name")

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )

        employee = Employee.objects.create(user=user, **validated_data)
        return employee
