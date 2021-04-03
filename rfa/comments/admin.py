from django.contrib import admin

from .models import Comment, Reply
class CommentAdmin(admin.ModelAdmin):
    model = Comment

admin.site.register(Comment, CommentAdmin)

class ReplyAdmin(admin.ModelAdmin):
    model = Reply

admin.site.register(Reply, ReplyAdmin)