from django.db import models
from django.utils import timezone
from authentication.models import Boss, Customer

class Restaurant(models.Model):
    boss = models.ForeignKey(Boss, on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Vote(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE,blank=True,null=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE,related_name='resturant_vote')
    vote = models.FloatField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer} voted {self.vote} for {self.restaurant}"

class Winner(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE,blank=True,null=True)
    date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"Winner: {self.restaurant.name} on {self.date}"
    
class History(models.Model):
    winner = models.ForeignKey(Winner,on_delete=models.CASCADE,blank=True,null=True)
