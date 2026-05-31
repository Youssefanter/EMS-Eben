from django.db import models
from django.contrib.auth.models import User
from datetime import date


# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def department_count(self):
        return self.departments.count()

    @property
    def employee_count(self):
        return self.employees.count()


class Department(models.Model):
    name = models.CharField(max_length=255)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="departments"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.company.name})"

    @property
    def active_employee_count(self):
        return self.employees.filter(is_active_status=True).count()


class Employee(models.Model):
    ROLE_CHOICES = (
        ("ADMIN", "System Administrator"),
        ("HR", "HR Manager"),
        ("EMPLOYEE", "Employee"),
    )

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="employee_profile"
    )

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="employees"
    )
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, related_name="employees"
    )

    mobile = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=100)
    hire_date = models.DateField()
    is_active_status = models.BooleanField(default=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="EMPLOYEE")

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.title}"

    @property
    def days_employed(self):
        if self.hire_date:
            return (date.today() - self.hire_date).days
        return 0
