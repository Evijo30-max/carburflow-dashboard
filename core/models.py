from django.db import models

class Site(models.Model):
    """
    Représente un site télécom ou technique (ex: BEPANDA INTERNATIONAL)
    """
    code_site = models.CharField(max_length=50, unique=True, help_text="Ex: BEPANDA_INT")
    nom = models.CharField(max_length=100)
    marque_ges = models.CharField(max_length=50, blank=True, null=True)
    puissance_kva = models.IntegerField(default=0)
    capacite_cuve_principale = models.FloatField(default=0.0, help_text="En Litres")
    capacite_cuve_journaliere = models.FloatField(default=0.0, help_text="En Litres")

    def __str__(self):
        return f"{self.nom} ({self.code_site})"


class RapportHebdomadaire(models.Model):
    """
    Représente l'en-tête d'une fiche de suivi de la semaine
    """
    date_fiche = models.DateField()
    semaine = models.CharField(max_length=50, help_text="Ex: 13 au 17 Juillet 2026")
    responsable = models.CharField(max_length=100, blank=True, null=True)
    date_importation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rapport {self.semaine} - {self.date_fiche}"


class LigneRapport(models.Model):
    """
    Représente le relevé hebdomadaire pour un site précis
    """
    ETAT_CHOICES = [
        ('F', 'Fonctionnel'),
        ('P', 'Panne / Partiel'),
        ('HS', 'Hors Service'),
    ]

    rapport = models.ForeignKey(RapportHebdomadaire, on_delete=models.CASCADE, related_name='lignes')
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='releves')
    etat_ges = models.CharField(max_length=2, choices=ETAT_CHOICES, default='F')
    volume_cuve_principale = models.FloatField(default=0.0)
    volume_cuve_journaliere = models.FloatField(default=0.0)
    compteur_horaire = models.FloatField(default=0.0, help_text="Heures de fonctionnement")
    observations = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Relevé {self.site.nom} - {self.rapport.semaine}"


class Depotage(models.Model):
    """
    Représente un mouvement de carburant (Livraison externe ou Transfert interne)
    """
    TYPE_CHOICES = [
        ('EXTERNE', 'Livraison Fournisseur / Marketeur'),
        ('INTERNE', 'Transfert inter-sites'),
    ]

    date_depotage = models.DateField()
    type_mouvement = models.CharField(max_length=10, choices=TYPE_CHOICES, default='EXTERNE')
    
    # Si transfert interne, site_source est le site qui DONNE le carburant
    site_source = models.ForeignKey(Site, on_delete=models.SET_NULL, null=True, blank=True, related_name='depotages_sortants')
    
    # Le site qui REÇOIT le carburant
    site_destination = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='depotages_entrants')
    
    volume_litres = models.FloatField(help_text="Quantité en Litres")
    reference_ou_fournisseur = models.CharField(max_length=100, help_text="Ex: Bon de livraison Neptune Oil ou camion")

    def __str__(self):
        return f"{self.type_mouvement} - {self.volume_litres}L vers {self.site_destination.nom}"