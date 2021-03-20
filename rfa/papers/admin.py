from django.contrib import admin

# Register your models here.
from .models import Paper
class PaperAdmin(admin.ModelAdmin):
    model = Paper

admin.site.register(Paper, PaperAdmin)
