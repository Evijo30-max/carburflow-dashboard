from rest_framework import serializers
from .models import Site, ReleveSemainier

class ReleveSemainierSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReleveSemainier
        fields = '__all__'

class SiteSerializer(serializers.ModelSerializer):
    releves = ReleveSemainierSerializer(many=True, read_only=True)

    class Meta:
        model = Site
        fields = '__all__'