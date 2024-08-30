from django.urls import path
from . import views

urlpatterns = [
    path('crud/<int:admin_id>/',views.RestaurantView.as_view(),name='crud-restaurant'),
    path('all/',views.getAllRestaurant.as_view(),name="get-all-restaurant"),
    path('vote/<int:restaurant_id>/<int:customer_id>/',views.getVoteResturant.as_view(),name='get-vote-restaurant'),
    path('winners/', views.WinnerHistory.as_view(), name='winner-history'),
    path('customer/<int:customer_id>/',views.getRestaurantVoteView.as_view(),name='get-restaurant-vote'),
    path('history/',views.PastHistory.as_view(),name='get-past-history'),
]
