from .models import LigneRapport, Depotage

# Ratio moyen de consommation théorique d'un GES (ex: 0.25 Litres/kVA/heure ou fixe à 15L/h pour un standard)
RATIO_LITRES_PAR_HEURE_PAR_KVA = 0.22 

def analyser_consommation_site(ligne_rapport_actuelle, ligne_rapport_precedente):
    """
    Calcule la consommation réelle, théorique et détecte les anomalies.
    """
    site = ligne_rapport_actuelle.site
    
    # 1. Calcul du delta des heures de marche
    heures_marche = ligne_rapport_actuelle.compteur_horaire - ligne_rapport_precedente.compteur_horaire
    if heures_marche < 0:
        heures_marche = 0 # En cas de remise à zéro du compteur

    # 2. Récupération des dépotages/transferts pendant la période
    depotages_entrants = Depotage.objects.filter(
        site_destination=site,
        date_depotage__range=[ligne_rapport_precedente.rapport.date_fiche, ligne_rapport_actuelle.rapport.date_fiche]
    )
    volume_depote = sum(d.volume_litres for d in depotages_entrants)

    depotages_sortants = Depotage.objects.filter(
        site_source=site,
        date_depotage__range=[ligne_rapport_precedente.rapport.date_fiche, ligne_rapport_actuelle.rapport.date_fiche]
    )
    volume_transfere = sum(d.volume_litres for d in depotages_sortants)

    # 3. Calcul Stock Début et Stock Fin (Cuve principale + Cuve journalière)
    stock_debut = ligne_rapport_precedente.volume_cuve_principale + ligne_rapport_precedente.volume_cuve_journaliere
    stock_fin = ligne_rapport_actuelle.volume_cuve_principale + ligne_rapport_actuelle.volume_cuve_journaliere

    # 4. Formule de Consommation Réelle
    consommation_reelle = stock_debut + volume_depote - volume_transfere - stock_fin

    # 5. Formule de Consommation Théorique
    # (Par exemple : puissance KVA x ratio x heures ou un débit fixe selon la puissance)
    puissance = site.puissance_kva if site.puissance_kva > 0 else 100 # Valeur par défaut si non renseigné
    consommation_theorique = heures_marche * (puissance * 0.2) 

    # 6. Ecart et statut d'alerte
    ecart_litres = consommation_reelle - consommation_theorique
    pourcentage_ecart = (ecart_litres / consommation_theorique * 100) if consommation_theorique > 0 else 0

    est_anomalie = pourcentage_ecart > 15.0 # Alerte si surconsommation > 15%

    return {
        'site': site.nom,
        'heures_marche': heures_marche,
        'stock_debut': stock_debut,
        'volume_depote': volume_depote,
        'stock_fin': stock_fin,
        'consommation_reelle': round(consommation_reelle, 2),
        'consommation_theorique': round(consommation_theorique, 2),
        'ecart_litres': round(ecart_litres, 2),
        'pourcentage_ecart': round(pourcentage_ecart, 2),
        'alerte_fraude': est_anomalie
    }