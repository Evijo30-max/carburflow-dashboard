from rest_framework import viewsets
from .models import Site, RapportHebdomadaire, LigneRapport, Depotage

class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    # Tu pourras mettre SiteSerializer une fois ton serializers.py mis à jour

class RapportHebdomadaireViewSet(viewsets.ModelViewSet):
    queryset = RapportHebdomadaire.objects.all()

class LigneRapportViewSet(viewsets.ModelViewSet):
    queryset = LigneRapport.objects.all()

class DepotageViewSet(viewsets.ModelViewSet):
    queryset = Depotage.objects.all()