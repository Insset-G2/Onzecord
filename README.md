# Onzecord
Une application de chat en ligne réalisée dans le cadre de l'UE Projet de spécialité de M1 Cloud Computing de l'INSSET —

> [!NOTE]  
> Même si j'expliquerai les différentes parties liées à l'intégration des autres membres du groupe au sein de l'application, ce document est principalement dédié à la partie que j'ai réalisée. Je vous invite à consulter les différents liens des membres du groupe pour plus d'informations sur leur travail.

> [!IMPORTANT]  
> La base de données utilisée pour ce projet et les différents microservices n'etant toujours pas opérationnels à l'heure actuelle ( 10/06/2024 ), des remaniements ont du être effectués pour que l'application soit fonctionnelle, 
au détriment de certaines fonctionnalités, notamment le microservice de Filleux Dimitri, qui ne peut pas fonctionner.

## Membres du groupe
- [Hecht Axel](https://github.com/hecht-a) — [ Lien du repo ↗ ](https://github.com/Insset-G2/translation)
    - Création d'un microservice de traduction de messages
- [Froment Kylian](https://github.com/KylianFroment) — [ Lien du repo ↗ ](https://github.com/Insset-G2/youtubeSearch)
    - Création d'un microservice de recherche Youtube
- [Filleux Dimitri](https://github.com/FilleuxStudio) — [ Lien du repo ↗ ](https://github.com/Insset-G2/userManager)
    - Création d'un système d'authentification
- [Dehame Gregory](https://github.com/GregoryDhm) — [ Lien du repo ↗ ](https://github.com/Insset-G2/db)
    - Mise en place d'une base de données
- [Caruelle Jeremy](https://github.com/Asgarrrr)
    - Réalisation de l'interface utilisateur, mise en place du serveur de gestion des messages, des utilisateurs etc. Mise en place de la connexion websocket et mise en commun des différents microservices.
- [Gallo Noah](https://github.com/NoahGallo) — [ Lien du repo ↗ ](https://github.com/Insset-G2/Mail)
    - Mise en place d'un service d'envois de mail
- [Pecqueux Leo](https://github.com/TheFrenchKix) — [ Lien du repo ↗ ](https://github.com/Insset-G2/cryptomonnaies)
    - Elaboration d'un microservice de récupération de d'informations sur différentes cryptomonnaies
- [Rohart Pascal](https://github.com/PascalRohart) — [ Lien du repo ↗ ](https://github.com/Insset-G2/reminder-manager)
    - Création d'un microservice de rappel de tâches

## Présentation de l'application
Onzecord est une application de **chat en ligne** qui permet à ses utilisateurs de discuter **en temps réel**, en suivant le modèle de Discord: des serveurs avec des salons. Chaque utilisateur est identifié par un pseudo et peut rejoindre des salons et envoyer des messages. ( Initialement, l'application devait également permettre de créer ses propre serveurs, channels et pouvoir inviter des amis à rejoindre ces serveurs par le biais d'un système d'invitation, fonctionnalité qui n'a pas pu être implémentée à cause de la non disponibilité de la base de données et donc d'une authentification des utilisateurs. )

## Technologies utilisées
L'application a été réalisée en utilisant, pour la partie front-end, le framework **Next.js** et pour la partie back-end, le framework **Express.js**. La communication entre le front-end et le back-end se fait par le biais de **WebSockets**. (Sockets.io). 

## Fonctionnalités
- **Connexion à un serveur/salon** : L'utilisateur peut se connecter à un serveur en renseignant un pseudo, il peut également indiquer un message d'activité, qui sera affiché dans la liste des utilisateurs de chaque channels

    ![alt text](https://gcdnb.pbrd.co/images/vxDR19vlPXAZ.png?o=1)
 
- **Affichage des utilisateurs** en temps réel : Lorsqu'un utilisateur se connecte à un serveur, il est ajouté à la liste des utilisateurs connectés. Lorsqu'il se déconnecte, il est retiré de cette liste. De même, si l'utilisateur change son pseudo ou son message d'activité, ces informations sont mises à jour en temps réel.

  2 utilisateurs connectés sur le même salon | 2 utilisateurs connectés sur 2 salons différents
  :-------------------------:|:-------------------------:
    ![](https://gcdnb.pbrd.co/images/jlWAai0SN9xe.png?o=1)  |  ![](https://gcdnb.pbrd.co/images/0WskafSrxWr3.png?o=1)

- **Envoi de messages** : L'utilisateur peut envoyer des messages dans un salon, et ces messages sont affichés en temps réel pour tous les utilisateurs connectés à ce salon.

- **Prise en charge du Markdown** : Les messages envoyés par les utilisateurs peuvent contenir du Markdown, qui sera interprété et affiché correctement. Cela inclut également les blocs de code, avec une coloration syntaxique adaptée au langage de programmation indiqué.
    ![alt text](https://gcdnb.pbrd.co/images/rUZiArqlqiwv.png?o=1)
    
- **Upload d'images** : L'utilisateur peut envoyer des images dans un salon.

    ![alt text](https://gcdnb.pbrd.co/images/S3Xa9fJLYl8c.png?o=1)

    Par le biais du bouton "Upload", l'utilisateur peut sélectionner jusqu'à 3 images à envoyer. Une fois les images sélectionnées, elles sont affichées en miniature. L'utilisateur peut alors les envoyer. Les images sont alors envoyées au serveur, qui les stocke dans un dossier spécifique. Les images sont ensuite affichées dans le salon, en miniature, et l'utilisateur peut cliquer dessus pour les afficher en grand.

    ![alt text](https://gcdnb.pbrd.co/images/HajEXLidhNUr.png?o=1)
    ![alt text](https://gcdnb.pbrd.co/images/Dcoq9yrO5gnR.png?o=1)

- **Commandes** : L'utilisateur peut envoyer des commandes pour effectuer certaines actions. C'est de cette manière que j'ai choisi d'intégrer les microservices basés sur les actions de l'utilisateur. 

  ![](https://gcdnb.pbrd.co/images/iPflKxNS0HhB.png?o=1)

  L'accès aux commandes se fait par le biais du racourci clavier `Ctrl + k`. Cela ouvre une fenêtre de commande, dans laquelle l'utilisateur peut taper une commande.

    ![alt text](https://gcdnb.pbrd.co/images/awWpXFDrx0fY.png?o=1)

    Le panel de commande permet de choisir dans un premier temps le service à utiliser, puis de choisir un sous-service, si nécessaire. Enfin, l'utilisateur peut renseigner les paramètres nécessaires à l'exécution de la commande. Une fois la commande envoyée, le résultat est affiché dans le salon.

    Je vais maintenant détailler les différentes commandes disponibles, qui permettent d'intégrer les microservices réalisés par les autres membres du groupe.

## Intégration des microservices
- **Traduction des messages** : L'utilisateur peut traduire un message dans une langue de son choix, parmie une liste de langues prédéfinies. Pour cela, il lui suffit faire un clic droit sur le message et de sélectionner "Traduire". Le message traduit sera affiché en dessous du message original

  Ce service a été réalisé par [Hecht Axel](https://github.com/Insset-G2/translation)
  
    Texte original | Traduction
    :-------------------------:|:-------------------------:
    ![alt text](https://gcdnb.pbrd.co/images/S5rsC9WChUkV.png?o=1) |  ![alt text](https://gcdnb.pbrd.co/images/aeQk6cKHjv1u.png?o=1)


- **Recherche Youtube** : L'utilisateur peut effectuer une recherche Youtube directement depuis le chat. Pour cela, il lui suffit de taper la commande `youtube`. Cela ouvre une section du panel de commande dans laquelle il peut taper sa recherche. Les résultats de la recherche sont affichés dans le salon, sous forme de liste de liens cliquables.


    ![alt text](https://gcdnb.pbrd.co/images/yFdxolrG7FJH.png?o=1)
    ![alt text](https://gcdnb.pbrd.co/images/hhrsqKy1hXDr.png?o=1)
    ![alt text](https://gcdnb.pbrd.co/images/xnv7eWcaV468.png?o=1)

  Ce service a été réalisé par [Froment Kylian](https://github.com/Insset-G2/youtubeSearch)

  Pour les prochaines services, je detaillerais moins les commandes, car elles sont plus complexes et nécessitent plusieurs étapes pour être exécutées. Vous êtes invités à essayer ces commandes pour voir leur fonctionnement.

- **Récupération d'informations sur les cryptomonnaies** : L'utilisateur peut obtenir des informations sur différentes cryptomonnaies. Pour cela, il lui suffit de taper la commande `crypto`. Cela ouvre une section du panel de commande dans laquelle il peut choisir la cryptomonnaie sur laquelle il souhaite obtenir des informations. Les informations sont affichées dans le salon. Un graphique représentant l'évolution du cours de la cryptomonnaie sur les 24 dernières heures est également affiché.

    ![alt text](https://gcdnb.pbrd.co/images/mpfVA9Gvpu31.png?o=1)

    Le premier choix permet de récupérer la valeur en euro des 4 cryptomonnaies proposées. Le deuxième choix permet de récupérer le cours de la cryptomonnaie sur les 24 dernières heures sous forme d'un graphique envoyé dans le salon.

    ![alt text](https://gcdnb.pbrd.co/images/KlBQfAB3wvrx.png?o=1)

  Ce service a été réalisé par [Pecqueux Leo](https://github.com/Insset-G2/cryptomonnaies)

- **Rappel de tâches** : L'utilisateur peut demander à être rappelé à une date et une heure précises. Pour cela, il lui suffit de taper la commande `rappel`. Cela ouvre une section du panel de commande dans laquelle il peut renseigner la date et l'heure du rappel, ainsi qu'un titre et une description. Lorsque l'heure du rappel est atteinte, un message est envoyé dans le salon pour rappeler à l'utilisateur la tâche à effectuer.

  Le microservice de rappel de tâches fonctionne conjointement avec le microservice **Mail** réalisé par [Gallo Noah](https://github.com/Insset-G2/Mail), qui envoie un mail à l'utilisateur pour le rappeler de la tâche à effectuer.

    ![alt text](https://gcdnb.pbrd.co/images/6YDt3Kb0k0R3.png?o=1)

  Ce service a été réalisé par [Rohart Pascal](https://github.com/Insset-G2/reminder-manager)