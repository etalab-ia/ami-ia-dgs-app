import React, { useState, useContext, useEffect } from 'react';
import PageLayout from '@layout/PageLayout.jsx';
import { Table, Tabs, Collapse, Col, Row } from 'antd';
import { GlobalContext } from '../../GlobalContext.js'
import { getModelsPerformances } from '../../requests';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const About = () => {
    const auth = useContext(GlobalContext).auth
    const [modelsPerfs, setModelPerfs] = useState({})

    useEffect(() => {
        getModelsPerformances([auth[0][0], auth[1][0]]).catch(e => {
            console.log(e)   
        }).then(r => {
            if (r && r.data) {
                r.data.datasource.map(x => {
                    for (var key in x) {
                        if (typeof x[key] == 'number') {
                            x[key] = Number(x[key]).toFixed(2)
                        }
                    }
                })

                r.data.columns = r.data.columns.map(c => {
                    return { ...c, align: "center", width: 150}
                })
                r.data.columns[0].width = 250
                setModelPerfs(r.data)
            }
        })
      }, [])


    return (
        <PageLayout title="About">
            <h1>Analyse des signalements de dysfonctionnement de matériel médical grâce aux techniques de l'intelligence artificielle</h1>

            <Tabs defaultActiveKey="3">
                <TabPane tab="Contexte" key="1">
                    <p>
                        La Sous-direction de la veille et de la sécurité sanitaire (SDVSS), service de la Direction Générale de la Santé (DGS), s'appuie pour la bonne mise en application de ses diverses missions 
                        sur un <b>portail de signalements en ligne</b> qui permet à tout citoyen ou aux professionnels de santé de déclarer tout <b>« événement sanitaire indésirable »</b>. 
                    </p>
                    <p>
                        Ces événements sont de différentes catégories : consécutifs à un acte de soins (chirurgie esthétique par exemple...), liés à l’exposition à un produit (consommation d’un médicament...) 
                        ou le fruit d’autres situations déterminées (réaction à la suite d’un tatouage...). Le portail propose aujourd’hui une vingtaine de catégories différentes. On dénombre 60 000 déclarations depuis l’ouverture du portail en mars 2017. Chaque déclaration contient une centaine de champs, données structurées ou champs libres.
                    </p>
                    <p>
                        <b>Le portail de signalements a vocation à devenir le point d’entrée unique de déclaration d’un « événement sanitaire indésirable »</b> et à élargir progressivement son champ d’application à de nouvelles catégories.
                    </p>
                    <p>
                        Toutefois, le système présente aujourd’hui certaines limites :
                    </p>
                    <ul>
                        <li>
                            Les outils informatiques actuels ne permettent qu’un traitement unitaire par les agents, déclaration par déclaration, limitant en cas de crise sanitaire la possibilité d’une analyse exhaustive et d’une priorisation des signalements.
                        </li>
                        <li>
                            La croissance prévisible du nombre de déclarations et du nombre de catégories de signalements obèrent à terme la possibilité d’une analyse uniquement manuelle des signalements.
                        </li>
                    </ul>
                    <p><br/></p>
                    <p>
                        <b>Le but de ce projet est donc d’aider les différentes structures de vigilance à analyser automatiquement le contenu des nouveaux signalements, de les prioriser (gravité, tri, ...) et 
                        d’effectuer un précodage selon les référentiels en vigueur pour faciliter l’analyse par l’évaluateur (produit, métier, ...) et le retour d’information auprès du déclarant.</b>
                    </p>
                    <p><br/></p>
                    <p>
                        Dans ce cadre, le projet s'est particulièrement appliqué aux déclarations de <i>matériovigilance</i> et de <i>bactériovigilance</i>. Il s'est attaché à:
                    </p>
                    <ul>
                        <li>
                            <b>coder automatiquement diverses variables</b> des déclarations: DCO, dysfonctionnement, effet et conséquences
                        </li>
                        <li>
                            <b>estimer la gravité des incidents</b>
                        </li>
                        <li>
                            <b>rapprocher chaque déclarations de déclarations existantes</b>
                        </li>
                        <li>
                            <b>Permettre une visualisation claire des différents groupes de déclarations</b>
                        </li>
                    </ul>
                    <p><br/></p>
                    <p>
                        Ce projet s'inscrit dans le cadre du marché public MS 10, "Marché subséquent relatif au développement d'outils de classification d'information dans le cadre du deuxième appel à manifestation d'intérêt pour expérimenter l'intelligence artificielle dans les administrations publiques.", porté par la Direction du Numérique.
                    </p>
                </TabPane>
                <TabPane tab="Techniques utilisées" key="2">
                    <Collapse>
                        <Panel header={<h2>1. Techniques de classification</h2>}>
                            <p>
                                La classification consiste à associer une classe à un signalement. Cette méthode ce base sur jeu de données labellisées permettant d'apprendre des relations entre les étiquettes et les caractéristiques des signalements.
                            </p>
                            Dans notre cas, nous avons 5 problèmes de classifications distincts:
                            <ul>
                                <li><b>inférence des DCO</b>: problème multi-classe avec environ 1000 classes distinctes</li>
                                <li><b>inférence du type de dysfonctionnements</b>: problème multi-classe et multi-label avec environ 800 classes</li>
                                <li><b>inférence du type de d'effets</b>: problème multi-classe et multi-label avec environ 250 classes</li>
                                <li><b>inférence du type de consequences</b>: problème multi-classe et multi-label avec environ 70 classes </li>
                                <li><b>inférence du type de la gravité</b>: problème multi-classe ordonées à 5 classes </li>
                            </ul>

                            <p>
                                <br/>
                                Pour chacun de ces problèmes de classification , nous devons réaliser les étapes suivantes:
                            </p>
                            <ul>
                                <li> La préparation des données</li>
                                <li> La séparation en jeu de train et de test pour évaluer les performances sur les données </li>
                                <li> Choix des métriques d'évaluation </li>
                                <li> Le choix du modèle </li>
                                <li> Entrainement du modèle sur la base de données complète</li>
                            </ul>
                            <p><br/></p>

                            <ol type="1">
                                <li><h3>Préparation des données</h3></li>
                            
                                    <p>
                                        La préparation des données est équivalente pour les 5 problèmes de classification:
                                    </p>
                                    <ul>
                                        <li> <b>Nettoyage des données textuelles pour chaque champs</b> :</li>
                                        <ul>
                                            <li> <b>DCO</b>: <i>"DESCRIPTION_INCIDENT", "FABRICANT","REFERENCE_COMMERCIALE", "LIBELLE_COMMERCIAL"</i></li>
                                            <li> <b>TYPO</b>: <i>"DESCRIPTION_INCIDENT", "ETAT_PATIENT","FABRICANT", "ACTION_PATIENT", "LIBELLE_COMMERCIAL"</i></li>
                                            <li> <b>GRAVITE</b>: <i>"DESCRIPTION_INCIDENT","ETAT_PATIENT", "FABRICANT", "CLASSIFICATION"</i></li>
                                        </ul>
                                        <li> <b>Vectorisation via un pipeline de tf-idf pour chaque colonne</b>. </li>
                                        <p>
                                            Le <a href='https://fr.wikipedia.org/wiki/TF-IDF' target="_blank">TF-IDF, ou <i>Term-Frequency/Inverse Document Frequency</i></a>, est une méthode permettant de représenter 
                                            un texte à partir des mots "importants" du document par rapport au corpus: plus le mot est fréquent dans le document, et peu présent dans le reste du corpus, plus il est jugé caractéristique du document.
                                            On calcule donc les mots les plus importants sur l'ensemble du corpus, on choisit les N premiers, puis on vectorise les documents en comptant les occurrences des mots dans les documents.
                                        </p>
                                        <p>Ex : Doc 1 -> [0, 1, 2, 0, 3, 0, ...] == le document 1 contient 0 occurrence du mot 1, 1 du mot 2, 2 du mot 3, 0 du mot 4, etc.</p>
                                        <li> <b>Changement de représentation  des variables catégorielles</b></li>
                                        <p>
                                            Cette étape consiste à attribuer une valeur numérique fixe à chaque valeur possible des variables pour lesquelles on connait la liste des valeurs possibles (ex : liste des DCO), et à utiliser cette valeur dans la suite du calcul.
                                        </p>
                                        <li> Pour les modèles de type deep-learning, <b>réduction de dimension</b> (<a href = 'https://fr.wikipedia.org/wiki/D%C3%A9composition_en_valeurs_singuli%C3%A8res' target="_blank"><b>algorithme SVD</b></a>)</li>
                                        <p>
                                            Cette étape revient à supprimer autant que possible l'information redondante, tout en limitant à la fois la quantité et l'importance informative des données non redondantes supprimée au passage.
                                            Elle permet de réduire le temps d'entrainement et d'augmenter les performances du modèle.
                                        </p>
                                    </ul>


                                <li><h3> Séparation  en jeu de donnée d'entrainement et de test</h3></li>
                                    <p>
                                        La création de ces jeux de données est une étape importante pour évaluer la qualité des modèles. En effet, il faut pouvoir calculer les performances d'un modèle entraîné à partir d'un jeu de données qu'il n'a jamais vu: le jeu de test. 
                                        Cela permet une estimation non biaisée du comportement qu'il aura une fois déployé pour analyser de nouveaux signalements.
                                    </p>
                                    
                                    Toutefois, cette séparation s'est avérée particulièrement difficile dans notre cas pour plusieurs raisons:<br/>
                                    <ul>
                                        <li> Le numéro de déclaration n'est pas un identifiant unique, donc il ne peut pas servir de séparation sinon le jeu de train et de test serait trop proche l'un de l'autre et les performances serait faussées</li>
                                        <li> Le problème de classification de la typologie s'est avérée être un problème multilabel (i.e. avec plusieurs classes possibles), il a donc été nécessaire de construire un jeu de donnée multilabel associé à chaque sous-classe de la typologie pour pouvoir évaluer les modèles.</li>
                                        <li> De manière générale, les classes étaient très déséquilibrées, ce qui peut fausser l'apprentissage:</li>
                                        <p>
                                            Si un dataset est composé à 99% de la classe 1, et à 1% de la classe 2, le modèle aura naturellement tendance à apprendre à prédire toujours "1", et les performances seront de 99% de réussite.
                                            Pourtant, un tel modèle est inutilisable, car a priori on souhaite détecter les occurrences de la classe 2.<br/>
                                            Nous devons donc adapté nos métriques et notre séparation train/test a cette configuration.
                                        </p>
                                    </ul>
                                    <p>
                                        Pour dépasser ces difficultés avons utilisé utilisé la <b>description complète de l'incident comme identifiant d'une déclaration</b>, et utilisé une méthode appelée <a href="http://scikit.ml/stratification.html" target="_blank">stratification de données multi-labels</a> qui permet de s'assurer une répartition intelligente des données similaires entre train et test.
                                    </p>

                                <li><h3> Choix des métriques d'évaluation </h3></li>
                                    <p>
                                        Nous avons choisi différents indicateur de performances pour les différentes variables en fonction des besoins et de la structure des données :
                                    </p>
                                    <ul>
                                        <li>  La <b>DCO et la GRAVITE 5 classes </b>  sont évalués selon la <a href ="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.balanced_accuracy_score.html" > balanced_accuracy </a> . Cette mesure étant définie comme la moyenne des recalls (cf presentation), elle permet de tenir compte du déséquilibre des classes et de nous pénaliser autant sur les classes peu fréquentes que sur les classes fréquentes.</li>
                                        <li>  La <b>Typologie </b> est évaluée selon le <a href ="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html" > f1-samples</a>. C'est la mesure classique des problèmes en multi-label.</li>
                                        <li> La <b>GRAVITE binaire </b> est évaluée selon le <a href ="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html" > f1-binary</a> sur la classe critique. Cette mesure nous permet de nous concentrer sur la détection de la classe critique.</li>
                                    </ul>
                                    <p>
                                        <br/>
                                        Pour comprendre plus en détails les métriques utilisées nous avons préparé un support de présentation disponible en suivant ce <a href = "https://starclay-my.sharepoint.com/:p:/g/personal/rquillivic_starclay_fr/EfyfEgs2qkRHuUkM5K3u_UIBP0bSmPtbm1f00aESCxAkgg?e=4jvmf1"> lien</a>.
                                    </p>
                                

                                <li><h3> Modèles </h3></li>
                                    <p>
                                        3 types de modèles ont été mis en place:
                                    </p>
                                    <ul>
                                        <li> <b><a href='https://fr.wikipedia.org/wiki/Machine_%C3%A0_vecteurs_de_support'>Support Vector Machines</a> (SVM):</b> Cet algorithme repose sur deux idées clés qui permettent de traiter des problèmes de discrimination non linéaire, et de reformuler le problème de classement comme un problème d'optimisation quadratique. Cette approche est très adapté a la classification de textes car l’implémentation faite par LIBLINEAR qui utilise un kernel linéaire est très performante sur des vecteurs de grande dimensions (comme ceux produit par les modèles vectoriels Tf-Idf).</li>
                                        <li> <b> <a href='https://medium.com/@CharlesCrouspeyre/comment-les-r%C3%A9seaux-de-neurones-%C3%A0-convolution-fonctionnent-c25041d45921'>Bi-LSTM:</a></b> réseaux de neurones récurrents du type LSTM bidirectionnels qui tiennent compte de l’aspect séquentiel des mots dans une phrase (et des paragraphes dans un document) et qui sont donc particulièrement adaptés aux données textuelles.</li>
                                        <li> <b>Ordinal SVM:</b> une petite astuce qui permet de tenir compte de l'ordre des classes et ainsi gérer le problème de la gravité. <a href='http://medicalresearch.inescporto.pt/breastresearch/data/_uploaded/publications/2005JaimeNN.pdf' target="_blank"><b>détails d'implementation</b></a></li>
                                    </ul>
                                    <p>
                                        <br/>
                                        Le choix de ces modèles s'est fait après avoir mené de nombreuses expériences qui sont référencées et documentées dans le dossier exploration de la Livraison. 
                                        <br/>
                                    </p>
                            </ol>    
                        </Panel>
                        <Panel header={<h2>2. Techniques de clustering</h2>}>
                            <p>
                                Le clustering consiste à tenter de regrouper les signalements par similarité. Il faut pour cela :
                            </p>
                            <ul>
                                <li>Définir ce que signifie "similarité" dans le contexte de travail</li>
                                <li>Définir et optimiser la façon de représenter les signalements pour permettre un calcul de similarité</li>
                                <li>Choisir et optimiser l'algorithme permettant de grouper les signalements</li>
                            </ul>
                            <p><br/> </p>

                            <ol>
                                <li><h3>Similarité</h3></li>
                                <p>
                                    Afin d'avaluer les modèles de clustering, la similarité a été définie comme le triplet  de variable :
                                </p>
                                <ul> 
                                    <li> DCO </li>
                                    <li> Fabricant </li>
                                    <li> Typologie </li>
                                </ul>
                                <p><br/> </p>
                                <p>
                                    Ce triplet de variables sépare la base de données Mrveille en 33 000 groupes (micro-cluster) disctincts. Ce partitionnement étant trop fin, nous souhaitons réaliser un partitionnement plus grossier (macro-cluster) qui se rapproche le plus possible de celui ci. pour cette raison, nous avons construit deux métriques :
                                </p>
                                <ul>
                                    <li> un micro score : il évalue à quel point un micro-cluster est regroupé dans un seul macro-cluster​​</li>
                                    <li> un macro score : il évalue à quel point un macro-cluster regroupe des micro-clusters semblables</li>
                                </ul>
                                <p><br/> </p>
                                <p>
                                    Le produit de ces deux scores est un bon indicateur de la qualité des modèles que nous allons construire par la suite.
                                </p>

                                <li><h3>Représentation des signalements: le Topic Modelling</h3></li>
                                <p>
                                    Pour pouvoir utiliser des algorithmes de machine learning pour clusteriser des données, il faut <b>exprimer ces données dans un représentation 
                                    compréhensible par la machine</b>. Cela consiste à <i>définir un espace numérique à N dimensions, chaque dimension représentant un aspect ou une 
                                    caractéristique du signalement exprimé sous forme numérique</i>.
                                </p>
                                <p>
                                    Une possibilité est de <b>prendre pour caractéristiques des champs normés des signalements</b>, tels que le fabriquant, le type de déclaration, etc.
                                    On définit une nomenclature des valeurs connues des valeurs de la caractéristique, et on attribue une valeur numérique à chaque valeur connue.
                                    Ce traitement est également possible pour les caractéristiques prédites lors de la phase de classification.
                                </p>
                                <p>
                                    Une autre solution, qui permet une analyse plus riche des documents, consiste à <b>tenter de trouver une façon de représenter le contenu textuel
                                    de chaque document</b>, en essayant d'extraire des caractéristiques communes en nombre fini permettant d'expliquer chaque document par une combinaison de ces caractéristiques.
                                </p>
                                <p> 
                                    Une telle approche est le <i><b>Topic Modelling</b></i>. Son principe est de partir du principe que l'ensemble des documents s'intéresse à 
                                    un nombre fini de sujets (les topics), chaque document n'abordant que quelques-uns de ces sujets. Pour cela, l'algorithme permettant de calculer ces topics
                                    (LDA : Latent Dirichlet Allocation) fonctionne de la manière suivante: pour un nombre fixé T de topic,
                                </p>
                                <ul>
                                    <li><b>Initialisation</b>: On attribue à chaque topic un ensemble d'occurrences de mots pris dans les divers documents. 
                                    Chaque mot de chaque document est donc attribué à un unique topic. Chaque topic a donc, pour chaque mot, une probabilité que le mot lui soit attribué.</li>
                                    <li><b>Etape 1: Update des mots</b> - on fixe les topics. Pour chaque document, on calcule la probabilité que le document soit expliqué par chaque topic, puis on met à jour l'attribution de chaque mot du document aux topics majoritaires.
                                    </li>
                                    <li><b>Etape 2: Update des topics</b> - on fixe maintenant les documents, et on recalcule les probabilités que chaque mot du corpus soit dans chaque topic. 
                                    </li>
                                    <li><b>Terminaison</b>: On applique en boucle les étapes 1 et 2 jusqu'à ce que les probabilités ne changent plus.</li>
                                </ul>
                                <p><br/> </p>
                                <p>
                                    A la fin de l'algorithme, chaque topic est donc un ensemble de probabilité que chaque mot du corpus le représente, et chaque document est un ensemble de probabilité 
                                    d'être représenté par chaque topic.
                                </p>
                                <p>Ces dernières probabilités sont une représentation des documents dans l'espace à T dimension des topics, et peuvent donc servir de caractéristiques pour être clusterisés: 
                                    <b>on a projeté les documents vers un espace à T dimensions à partir de leur contenu textuel</b>.
                                </p>
                                <p>
                                    Les résultats de cet algorithmes sont visualisables :
                                </p>
                                <ul>
                                    <li><b>Lors de la clusterisation d'un nouveau document:</b> le tableau "topics" montre les topics expliquant le mieux le document, et la probabilité associé</li>
                                    <li><b>Dans l'onglet visualisation/topics:</b> le nuage de mot montre les mots qui sont le plus souvent attribués au topic, et le score associé.</li>
                                </ul>
                                <p><br/> </p>

                                <p> 
                                    Nous avons ici choisi dans ce projet une combinaison des approches précédentes: utilisation de champs connus, de champs prédits, et d'analyse textuelle sous forme de topics.
                                </p>
                                <li><h3>Regroupement des signalements: le clustering via l'algorithme des K-means</h3></li>
                                <p>
                                    Une fois la représentation numérique de chaque document calculée, on utilise un algorithme permettant de calculer un regroupement des signalements:
                                    le <i><b>K-Means</b></i>
                                </p>
                                <p>
                                    L'algorithme est lui aussi itératif :
                                </p>
                                <ul>
                                    <li><b>Initialisation</b>: On répartit au hasard (ou selon d'autres méthodes) les documents en K groupes. Pour chaque groupe (cluster), 
                                    on calcule les coordonnées de son centre (moyenne des représentations numériques des documents du groupe).</li>
                                    <li><b>Etape 1: Update de la répartition</b> - on fixe les centres des clusters. Pour chaque document, on recalcule le centre le plus proche, et on attribue le document au cluster associé.
                                    </li>
                                    <li><b>Etape 2: Update des centres</b> - On recalcule les positions des centres de chaque cluster.
                                    </li>
                                    <li><b>Terminaison</b>: On applique en boucle les étapes 1 et 2 jusqu'à ce que les documents ne changent plus de cluster.</li>
                                </ul>
                                <p><br/> </p>

                                <p>
                                    Les résultats peuvent être visualisés ainsi: 
                                </p>
                                <ul>
                                    <li><b>Lors de la clusterisation d'un nouveau document:</b> On a ici complexifié un peu le processus, 
                                        car le modèle utilise comme input les résultats des modèles de classification. On utilise donc le processus suivant:
                                        <ol>
                                            <li>on calcule les prédictions des modèles de classification</li>
                                            <li>on calcule la représentation sous forme de topics du document</li>
                                            <li>Le modèle utilisant les outputs de tous les modèles sauf les modèles de gravité, on créée 16 documents ayant chacun 
                                                la même représentation de topics, mais une combinaison différentes des 2 meilleures prédictions de chaque modèle (2^4 choix)
                                            </li>
                                            <li>on clusterise les 16 documents en calculant, pour chaque document, un score associé à chaque cluster basé sur la distance du document à chaque centre.</li>
                                            <li>on fait une somme des prédictions de clusterisation pondérée des scores combinés des prédictions utilisées pour chaque document</li>
                                            <li>Le cluster le plus probable est celui avec le score le plus élevé</li>
                                        </ol> 
                                        Ces scores sont visibles dans le tableau "clusters".
                                    </li>
                                    <li><b>Dans l'onglet Visualisation/cluster:</b> pour un cluster donné, on peut calculer le nuage de mot sur les documents du cluster,
                                        ainsi que les DCOs majoritaires sur ces documents et leurs topics majoritaires.</li>
                                </ul>
                            </ol>
                        </Panel>
                    </Collapse>
                </TabPane>
                <TabPane tab="Explication des visualisations" key="3">
                    <ol>
                        <li><h2>Prédictions</h2></li>
                        <div>
                            Chacun des 6 premiers tableaux présente les résultats d'inférence d'un modèle de classification.
                            <ul>
                                <li>colonne 1: <b>libellé de la classe prédite</b> (titre : valeur prédite)</li>
                                <li>colonne 2: <b>probabilité associée à la classe</b> (limité aux 10 meilleures classes</li>
                            </ul>
                        </div><br/>
                        <p>
                            Les deux tableaux du bas représentent respectivement les <b>topics explicatifs du document</b>, et la <b>prédiction du cluster de rattachement</b>.
                            Les topics "expliquent" le document, les scores ne sont donc pas exclusifs (le document est expliqué à X% par le topic i, à Y% par le topic j, etc.).
                            En revanche, le document n'est attribuable qu'à un seul cluster.
                        </p>
                        <p>Se rapporter à l'onglet "Techniques utilisées" pour plus d'explications.</p>
                        <br/>
                        <li><h2>Visualisation : Document</h2></li>
                        <p>Cette page permet de visualiser un document de la base MRVeil, ainsi que la distribution de topics expliquant ce document sous forme d'un graphique bar.</p>
                        <p>Le texte s'affichant en info-bulle est le groupe de 10 mots caractérisants le mieux le topic concerné.</p>
                        <li><h2>Visualisation : Topic</h2></li>
                        <p>Cette page permet de visualiser un topic indexé par son numéro. Les topics vont de 1 à N (N étant visible dans la visualisation globale des topics), par ordre d'importance décroissant.</p>
                        <p>Pour un topic donné, sont proposés :</p>
                        <ul>
                            <li><b>Son poid dans le corpus</b>: c'est le pourcentage d'occurences de mots qui lui sont attribués</li>
                            <li><b>Son nuage de mot</b>: les mots les plus importants du topic sont à la fois plus gros et plus sombres. La fréquence relative en info-bulle est la probabilité qu'une occurence de ce mot soit attribuée au topic en cours</li>
                            <li><b>Ses documents les plus représentatifs</b>: les documents ayant le plus d'occurences de mots attribués à ce topic, donc ceux qui sont "le mieux expliqués par" ce topic</li>
                        </ul>
                        <p>Se rapporter à l'onglet "Techniques utilisées" pour plus d'explications sur les topics.</p>
                        <li><h2>Visualisation : Cluster</h2></li>
                        <p> Cette page permet de visulaiser un cluster indexé par son numéro. Les clusters vont de 0 à N (N étant visible dans la visualisation globale des clusters), sans ordre particulier.</p>
                        <p>Pour un cluster donné, sont proposés:</p>
                        <ul>
                            <li><b>Son poids dans le corpus</b>: nombre de documents qui lui sont attachés, et pourcentage du nombre de documents que cela représente.</li>
                            <li><b>Son nuage de mots</b>: calculé sur les documents qui lui sont rattachés, les mots ayant le plus d'occurence étant plus gros et plus sombres.</li>
                            <li><b>Ses topics majoritaires</b>: calculés en aggrégeant les scores des topics des documents du cluster.</li>
                            <li><b>Ses DCOs majoritaires</b>: calculées en aggrégeant les DCO déclérées des documents du cluster.</li>
                            <li><b>Ses documents les plus représentatifs</b>: les documents du cluster, classés du plus proche du centre au plus lointain.</li>
                        </ul>
                        <p>Se rapporter à l'onglet "Techniques utilisées" pour plus d'explications sur les clusters.</p>
                        <li><h2>Visualisation : Modèle de topic modelling</h2></li>
                        <p>Cette page permet de visualiser de manière plus globale les topics et leur distribution.</p>
                        <p>Sont proposés:</p>
                        <ul>
                            <li><b>Le nombre de topics et le score de cohérence U-MASS du modèle</b>. Ce score de cohérence permet de mesurer la séparation des topics: les ensemble de leurs mots principaux sont disjoints. Plus ce score est proche de 0, plus la cohérence est bonne. Il sert principalement à comparer entre eux deux modèles.</li>
                            <li><b>Une visualisation en 2 dimension des topics</b>: cette visualisation permet, en cliquant sur un topic donné, de visualiser les mots qui le caractérisent.</li> 
                            <p>Le paramêtre lambda permet de choisir ce que 'caractérise' veut dire dans le contexte: 
                                Si lambda = 1, on affiche les mots ayant la plus haute probabilité dans le topic (ayant le plus d'occurence associées au topic), et si lambda = 0, on pondère la probabilité précédente par la probabilité du mot dans le corpus.
                            </p>
                            <p>
                                Autrement dit, lambda = 1 => mots les plus fréquents du topics, lambda = 0 => mots les plus rares du corpus attribués au topic. 
                            </p>
                            <li><b>Heatmap</b>: cette représentation montre la similarité de Jaccard entre les paires de topics, c'est à dire 1 - (nombre de mots principaux communs à 2 topics) / (ensemble des mots principaux de ces 2 topics).</li>
                            <p>Cette distance est donc de 0 entre un topic et lui-même, et de 1 si les topics sont complètement disjoints. On cherche à disjoindre au maximum les modèles.</p>
                        </ul>
                        <li><h2>Visualisation: Modèle de clustering</h2></li>
                        <p>Cette page permet de visualiser de manière plus globale le modèle de clustering.</p>
                        <p>Sont proposés :</p>
                        <ul>
                            <li><b>Le nombre de clusters, et les scores du modèle, qui ici aussi servent principalement à comparer des modèles entre eux.</b></li>
                            <ul>
                                <li><a href='https://fr.wikipedia.org/wiki/Indice_de_Calinski-Harabasz' target="_blank"><b>Calinski Harabasz</b></a>: c'est le rapport entre la variance inter-groupe et la variance intra-groupe, c'est à dire entre la dissimilarité des individus de clusters différents et la similarité des individus d'un même cluster. Il varie de 0 (pire cas : on ne distingue pas plus de similarité au sein d'un cluster qu'entre différentes clusters) et l'infini.</li>
                                <li><a href='https://fr.wikipedia.org/wiki/Indice_de_Davies-Bouldin' target="_blank"><b>Davies Bouldin</b></a>: c'est la valeur maximale des rapport entre la distance d'un document à son centre de cluster et la distance entre 2 centres. Il varie de 0 (meilleur cas: tous les documents sont tous très proches de leur centre, et les clusters sont très éloignés), et l'infini.</li>
                                <li><a href='https://fr.wikipedia.org/wiki/Silhouette_(clustering)' target="_blank"><b>Silhouette</b></a>: c'est la moyenne de la différence entre la distance moyenne d'un document aux documents des clusters voisins et la distance moyenne de ce même document aux autres documents du cluster. Elle varie de -1 (pire cas: la distance moyenne aux documents d'autres clusters est systématiquement moins grande que celle aux autres documents du même cluster) à 1.</li>
                            </ul>
                            <li><b>Une visualisation en 2d des clusters</b>: en rentrant un numéro dans le champs de recherche ou en cliquant sur une bulle, vous pourrez visualiser
                            le cluster associé : ses topics majoritaires, mots les plus fréquents et DCOs majoritaires.</li>
                            <li><b>Heatmap</b>: cette représentation montre la distance cosinus (produit scalaire) entre les centres des clusters 2 à 2. Plus cette distance est grande, plus les clusters sont différents.</li>
                        </ul>
                    </ol>
                </TabPane>
                <TabPane tab="Résultats obtenus" key="4">
                    <h2>Résultats des modèles de prédiction</h2>
                    <Row justify="center">
                        <Col span={12}>
                            <Table bordered
                                    pagination={{ pageSize: 6, pageSizeOptions: [] }}
                                    columns={modelsPerfs?.columns} dataSource={modelsPerfs?.datasource}
                                    size="small" />
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </PageLayout>
    );
};

export default About;
