from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    SiteViewSet, 
    RapportHebdomadaireViewSet, 
    LigneRapportViewSet, 
    DepotageViewSet
)

router = DefaultRouter()
router.register(r'sites', SiteViewSet)
router.register(r'rapports', RapportHebdomadaireViewSet)
router.register(r'lignes-rapport', LigneRapportViewSet)
router.register(r'depotages', DepotageViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]