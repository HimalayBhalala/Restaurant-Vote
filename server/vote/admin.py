from django.contrib import admin
from .models import Restaurant,Vote,Winner,History
from authentication.models import User

# Register your models here.

class RestaurantAdmin(admin.ModelAdmin):
    list_display = ["id","name","boss"]
    
    def has_add_permission(self, request):
        return request.user.is_staff

    def has_change_permission(self, request, obj=None):
        return request.user.is_staff

    def has_delete_permission(self, request, obj=None):
        return request.user.is_staff

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(is_staff=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
admin.site.register(Restaurant,RestaurantAdmin)

class VoteAdmin(admin.ModelAdmin):
    list_display = ["id","customer","restaurant","vote","date"]
admin.site.register(Vote,VoteAdmin)

class WinnerAdmin(admin.ModelAdmin):
    list_display = ["id","restaurant","date"]
admin.site.register(Winner,WinnerAdmin)

class HistoryAdmin(admin.ModelAdmin):
    list_display = ["id","winner","date"]
admin.site.register(History,HistoryAdmin)