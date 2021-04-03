from django.contrib import admin

# Register your models here.
from .models import CustomUser
class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser

admin.site.register(CustomUser, CustomUserAdmin)

from .models import ReadingList
class ReadingListAdmin(admin.ModelAdmin):
    model = ReadingList

admin.site.register(ReadingList, ReadingListAdmin)
