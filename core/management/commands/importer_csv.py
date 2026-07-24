import os
import csv
from datetime import datetime
from django.conf import settings
from django.core.management.base import BaseCommand
from core.models import Site, RapportHebdomadaire, LigneRapport, Depotage


class Command(BaseCommand):
    help = "Importe les données des fichiers CSV de relevé hebdo et de dépotage"

    def handle(self, *args, **options):
        self.stdout.write("--- Début de l'importation ---")

        # 1. IMPORTATION DU RELEVÉ HEBDOMADAIRE
        chemin_releve = os.path.join(settings.BASE_DIR, 'fichierTexte', 'releve_hebdo.csv')

        try:
            with open(chemin_releve, mode='r', encoding='utf-8') as file:
                reader = csv.DictReader(file, delimiter=';')

                date_aujourdhui = datetime.now().date()
                rapport, _ = RapportHebdomadaire.objects.get_or_create(
                    date_fiche=date_aujourdhui,
                    defaults={'semaine': 'Import CSV Automatique', 'responsable': 'Client / Admin'}
                )

                for row in reader:
                    site, _ = Site.objects.get_or_create(
                        code_site=row['code_site'],
                        defaults={'nom': row['code_site'].replace('_', ' ')}
                    )

                    LigneRapport.objects.create(
                        rapport=rapport,
                        site=site,
                        etat_ges=row['etat_ges'],
                        volume_cuve_principale=float(row['volume_cuve_principale']),
                        volume_cuve_journaliere=float(row['volume_cuve_journaliere']),
                        compteur_horaire=float(row['compteur_horaire']),
                        observations=row['remarques']
                    )
            self.stdout.write(self.style.SUCCESS("✅ Relevés hebdomadaires importés avec succès !"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Erreur lors de l'import du relevé : {e}"))

        # 2. IMPORTATION DES DÉPOTAGES
        chemin_depotage = os.path.join(settings.BASE_DIR, 'fichierTexte', 'depotages.csv')

        try:
            with open(chemin_depotage, mode='r', encoding='utf-8') as file:
                reader = csv.DictReader(file, delimiter=';')

                for row in reader:
                    site_dest, _ = Site.objects.get_or_create(
                        code_site=row['site_destination'],
                        defaults={'nom': row['site_destination'].replace('_', ' ')}
                    )

                    site_src = None
                    if row['site_source']:
                        site_src, _ = Site.objects.get_or_create(
                            code_site=row['site_source'],
                            defaults={'nom': row['site_source'].replace('_', ' ')}
                        )

                    date_formatted = datetime.strptime(row['date_depotage'], '%d/%m/%Y').date()

                    Depotage.objects.create(
                        date_depotage=date_formatted,
                        type_mouvement=row['type_mouvement'],
                        site_source=site_src,
                        site_destination=site_dest,
                        volume_litres=float(row['volume_litres']),
                        reference_ou_fournisseur=row['fournisseur_ou_ref']
                    )
            self.stdout.write(self.style.SUCCESS("✅ Dépotages importés avec succès !"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Erreur lors de l'import des dépotages : {e}"))