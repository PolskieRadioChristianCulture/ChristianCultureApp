
import { BibleVerse, DualBibleVerse } from '../types';

export type VerseCategory = 'evangelistic' | 'missionary' | 'worship';

export interface CategorizedVerse {
  pl: BibleVerse;
  en: BibleVerse;
  category: VerseCategory;
}

export const DAILY_VERSES: CategorizedVerse[] = [
  // EWANGELIZACYJNA (Evangelistic)
  {
    pl: { reference: "J 3,16", text: "Tak bowiem Bóg umiłował świat, że Syna swego Jednorodzonego dał, aby każdy, kto w Niego wierzy, nie zginął, ale miał życie wieczne." },
    en: { reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Rz 5,8", text: "Bóg zaś okazuje nam swoją miłość właśnie przez to, że Chrystus umarł za nas, gdyśmy byli jeszcze grzesznikami." },
    en: { reference: "Romans 5:8", text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ef 2,8-9", text: "Łaską bowiem jesteście zbawieni przez wiarę. A to pochodzi nie od was, lecz jest darem Boga: nie z uczynków, aby się nikt nie chlubił." },
    en: { reference: "Ephesians 2:8-9", text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "J 14,6", text: "Odpowiedział mu Jezus: Ja jestem drogą i prawdą, i życiem. Nikt nie przychodzi do Ojca inaczej jak tylko przeze Mnie." },
    en: { reference: "John 14:6", text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Rz 10,9", text: "Jeżeli więc ustami swoimi wyznasz, że JEZUS JEST JAHWE, i w sercu swoim uwierzysz, że Bóg Go wskrzesił z martwych - osiągniesz zbawienie." },
    en: { reference: "Romans 10:9", text: "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "J 1,12", text: "Wszystkim tym jednak, którzy Je przyjęli, dało moc, aby się stali dziećmi Bożymi, tym, którzy wierzą w imię Jego." },
    en: { reference: "John 1:12", text: "Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ap 3,20", text: "Oto stoję u drzwi i kołaczę: jeśli kto posłyszy mój głos i drzwi otworzy, wejdę do niego i będę z nim wieczerzał, a on ze Mną." },
    en: { reference: "Revelation 3:20", text: "Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in and eat with that person, and they with me." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Mt 11,28", text: "Przyjdźcie do Mnie wszyscy, którzy utrudzeni i obciążeni jesteście, a Ja was pokrzepię." },
    en: { reference: "Matthew 11:28", text: "Come to me, all you who are weary and burdened, and I will give you rest." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Iz 1,18", text: "Chodźcie i spór rozstrzygnijmy! - mówi Jahwe. Choćby wasze grzechy były jak szkarłat, jak śnieg wybieleją." },
    en: { reference: "Isaiah 1:18", text: "'Come now, let us settle the matter,' says the Lord. 'Though your sins are like scarlet, they shall be as white as snow.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "J 10,10", text: "Złodziej przychodzi tylko po to, aby kraść, zabijać i niszczyć. Ja przyszedłem po to, aby owce miały życie i miały je w obfitości." },
    en: { reference: "John 10:10", text: "The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full." },
    category: 'evangelistic'
  },

  // MISYJNA (Missionary)
  {
    pl: { reference: "Mt 28,19-20", text: "Idźcie więc i nauczajcie wszystkie narody, udzielając im chrztu w imię Ojca i Syna, i Ducha Świętego. Uczcie je zachowywać wszystko, co wam przykazałem." },
    en: { reference: "Matthew 28:19-20", text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you." },
    category: 'missionary'
  },
  {
    pl: { reference: "Mk 16,15", text: "I rzekł do nich: Idźcie na cały świat i głoście Ewangelię wszelkiemu stworzeniu!" },
    en: { reference: "Mark 16:15", text: "He said to them, 'Go into all the world and preach the gospel to all creation.'" },
    category: 'missionary'
  },
  {
    pl: { reference: "Dz 1,8", text: "Ale gdy Duch Święty zstąpi na was, otrzymacie Jego moc i będziecie moimi świadkami w Jerozolimie i w całej Judei, i w Samarii, i aż po krańce ziemi." },
    en: { reference: "Acts 1:8", text: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judeia and Samaria, and to the ends of the earth." },
    category: 'missionary'
  },
  {
    pl: { reference: "Iz 6,8", text: "I usłyszałem głos Jahwe mówiącego: Kogo mam posłać? Kto by Nam poszedł? Odpowiedziałem: Oto ja, poślij mnie!" },
    en: { reference: "Isaiah 6:8", text: "Then I heard the voice of the Lord saying, 'Whom shall I send? And who will go for us?' And I said, 'Here am I. Send me!'" },
    category: 'missionary'
  },
  {
    pl: { reference: "Rz 10,14-15", text: "Jakże więc mieli wzywać Tego, w którego nie uwierzyli? Jakże mieli uwierzyć w Tego, o którym nie słyszeli? Jakże mieli słyszeć, gdy im nikt nie głosił? Jakże mogliby głosić, jeśliby nie zostali posłani?" },
    en: { reference: "Romans 10:14-15", text: "How, then, can they call on the one they have not believed in? And how can they believe in the one of whom they have not heard? And how can they hear without someone preaching to them? And how can anyone preach unless they are sent?" },
    category: 'missionary'
  },
  {
    pl: { reference: "Mt 9,37-38", text: "Wtedy rzekł do uczniów swoich: Żniwo wprawdzie wielkie, ale robotników mało. Proście Jahwe żniwa, żeby wyprawił robotników na swoje żniwo." },
    en: { reference: "Matthew 9:37-38", text: "Then he said to his disciples, 'The harvest is plentiful but the workers are few. Ask the Lord of the harvest, therefore, to send out workers into his harvest field.'" },
    category: 'missionary'
  },
  {
    pl: { reference: "2 Tm 4,2", text: "Głoś naukę, nastawaj w porę, nie w porę, w razie potrzeby wykaż błąd, poucz, podnieś na duchu z całą cierpliwością, ilekroć nauczasz." },
    en: { reference: "2 Timothy 4:2", text: "Preach the word; be prepared in season and out of season; correct, rebuke and encourage—with great patience and careful instruction." },
    category: 'missionary'
  },
  {
    pl: { reference: "Mt 5,14", text: "Wy jesteście światłem świata. Nie może się ukryć miasto położone na górze." },
    en: { reference: "Matthew 5:14", text: "You are the light of the world. A town built on a hill cannot be hidden." },
    category: 'missionary'
  },
  {
    pl: { reference: "1 P 3,15", text: "Jahwe zaś Chrystusa miejcie w sercach za Świętego i bądźcie zawsze gotowi do obrony wobec każdego, kto domaga się od was uzasadnienia tej nadziei, która w was jest." },
    en: { reference: "1 Peter 3:15", text: "But in your hearts revere Christ as Lord. Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have." },
    category: 'missionary'
  },
  {
    pl: { reference: "Kol 4,5-6", text: "Wobec tych, którzy są z zewnątrz, postępujcie mądrze, wyzyskując każdą chwilę. Mowa wasza niech zawsze będzie miła, zaprawiona solą." },
    en: { reference: "Colossians 4:5-6", text: "Be wise in the way you act toward outsiders; make the most of every opportunity. Let your conversation be always full of grace, seasoned with salt." },
    category: 'missionary'
  },

  // UWIELBIENIOWA (Worship)
  {
    pl: { reference: "Ps 100,1-2", text: "Wykrzykujcie na cześć Jahwe, wszystkie ziemie; służcie Jahwe z weselem! Wchodźcie przed Jego oblicze z radosnym śpiewem!" },
    en: { reference: "Psalm 100:1-2", text: "Shout for joy to the Lord, all the earth. Worship the Lord with gladness; come before him with joyful songs." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 150,6", text: "Wszystko, co żyje, niech chwali Jahwe! Alleluja!" },
    en: { reference: "Psalm 150:6", text: "Let everything that has breath praise the Lord. Praise the Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,2", text: "Chcę błogosławić Jahwe w każdym czasie, na ustach moich zawsze Jego chwała." },
    en: { reference: "Psalm 34:1", text: "I will extol the Lord at all times; his praise will always be on my lips." },
    category: 'worship'
  },
  {
    pl: { reference: "J 4,23", text: "Nadchodzi jednak godzina, owszem już jest, kiedy to prawdziwi czciciele będą oddawać cześć Ojcu w Duchu i prawdzie." },
    en: { reference: "John 4:23", text: "Yet a time is coming and has now come when the true worshipers will worship the Father in the Spirit and in truth." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 95,1", text: "Przyjdźcie, radośnie śpiewajmy Jahwe, wznośmy okrzyki ku czci Skały naszego zbawienia!" },
    en: { reference: "Psalm 95:1", text: "Come, let us sing for joy to the Lord; let us shout aloud to the Rock of our salvation." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 23,1", text: "Jahwe jest pasterzem moim, niczego mi nie braknie." },
    en: { reference: "Psalm 23:1", text: "The Lord is my shepherd, I lack nothing." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 23,2", text: "Pozwala mi leżeć na zielonych pastwiskach. Prowadzi mnie nad wody, gdzie mogę odpocząć." },
    en: { reference: "Psalm 23:2", text: "He makes me lie down in green pastures, he leads me beside quiet waters." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 23,3", text: "Przywraca mi życie. Prowadzi mnie właściwymi drogami ze względu na swoje imię." },
    en: { reference: "Psalm 23:3", text: "He refreshes my soul. He guides me along the right paths for his name’s sake." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 23,4", text: "Chociażbym chodził ciemną doliną, zła się nie ulęknę, bo Ty jesteś ze mną. Twój kij i Twoja laska są moją pociechą." },
    en: { reference: "Psalm 23:4", text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 23,5", text: "Stół dla mnie zastawiasz na oczach moich przeciwników. Olejkiem namaszczasz mi głowę, mój kielich jest pełny po brzegi." },
    en: { reference: "Psalm 23:5", text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 23,6", text: "Tak, dobroć i łaska pójdą w ślad za mną przez wszystkie dni mego życia i zamieszkam w domu Jahwe na długie dni." },
    en: { reference: "Psalm 23:6", text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever." },
    category: 'worship'
  },
  {
    pl: { reference: "J 1,1", text: "Na początku było Słowo, a Słowo było u Boga, i Bogiem było Słowo." },
    en: { reference: "John 1:1", text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "J 1,14", text: "A Słowo stało się ciałem i zamieszkało wśród nas. I oglądaliśmy Jego chwałę, chwałę, jaką Jednorodzony otrzymuje od Ojca, pełen łaski i prawdy." },
    en: { reference: "John 1:14", text: "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Rz 1,16", text: "Bo ja nie wstydzę się Ewangelii, jest ona bowiem mocą Bożą ku zbawieniu dla każdego wierzącego, najpierw dla Żyda, potem dla Greka." },
    en: { reference: "Romans 1:16", text: "For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes: first to the Jew, then to the Gentile." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Rz 3,23", text: "Wszyscy bowiem zgrzeszyli i pozbawieni są chwały Bożej." },
    en: { reference: "Romans 3:23", text: "For all have sinned and fall short of the glory of God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Rz 6,23", text: "Albowiem zapłatą za grzech jest śmierć, a łaska przez Boga dana to życie wieczne w Chrystusie Jezusie, Jahwe naszym." },
    en: { reference: "Romans 6:23", text: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Rz 5,8", text: "Bóg zaś okazuje nam swoją miłość właśnie przez to, że Chrystus umarł za nas, gdyśmy byli jeszcze grzesznikami." },
    en: { reference: "Romans 5:8", text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Rz 10,9", text: "Jeżeli więc ustami swoimi wyznasz, że JEZUS JEST JAHWE, i w sercu swoim uwierzysz, że Bóg Go wskrzesił z martwych - osiągniesz zbawienie." },
    en: { reference: "Romans 10:9", text: "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Rz 10,13", text: "Każdy bowiem, kto wezwie imienia Pańskiego, będzie zbawiony." },
    en: { reference: "Romans 10:13", text: "For, 'Everyone who calls on the name of the Lord will be saved.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ef 2,8", text: "Łaską bowiem jesteście zbawieni przez wiarę. A to pochodzi nie od was, lecz jest darem Boga." },
    en: { reference: "Ephesians 2:8", text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ef 2,9", text: "Nie z uczynków, aby się nikt nie chlubił." },
    en: { reference: "Ephesians 2:9", text: "Not by works, so that no one can boast." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ef 2,10", text: "Jesteśmy bowiem Jego dziełem, stworzeni w Chrystusie Jezusie dla dobrych czynów, które Bóg z góry przygotował, abyśmy je pełnili." },
    en: { reference: "Ephesians 2:10", text: "For we are God’s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 1,9", text: "Jeżeli wyznajemy nasze grzechy, Bóg jako wierny i sprawiedliwy odpuści je nam i oczyści nas z wszelkiej nieprawości." },
    en: { reference: "1 John 1:9", text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 5,11", text: "A świadectwo jest takie: że Bóg dał nam życie wieczne, a to życie jest w Jego Synu." },
    en: { reference: "1 John 5:11", text: "And this is the testimony: God has given us eternal life, and this life is in his Son." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 5,12", text: "Kto ma Syna, ma życie, a kto nie ma Syna Bożego, nie ma też i życia." },
    en: { reference: "1 John 5:12", text: "Whoever has the Son has life; whoever does not have the Son of God does not have life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 5,13", text: "O tym napisałem do was, którzy wierzycie w imię Syna Bożego, abyście wiedzieli, że macie życie wieczne." },
    en: { reference: "1 John 5:13", text: "I write these things to you who believe in the name of the Son of God so that you may know that you have eternal life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "J 5,24", text: "Zaprawdę, zaprawdę, powiadam wam: Kto słucha słowa mego i wierzy w Tego, który Mnie posłał, ma życie wieczne i nie idzie na sąd, lecz ze śmierci przeszedł do życia." },
    en: { reference: "John 5:24", text: "Very truly I tell you, whoever hears my word and believes him who sent me has eternal life and will not be judged but has crossed over from death to life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "J 6,47", text: "Zaprawdę, zaprawdę, powiadam wam: Kto wierzy, ma życie wieczne." },
    en: { reference: "John 6:47", text: "Very truly I tell you, the one who believes has eternal life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "J 11,25", text: "Powiedział do niej Jezus: Ja jestem zmartwychwstaniem i życiem. Kto we Mnie wierzy, choćby i umarł, żyć będzie." },
    en: { reference: "John 11:25", text: "Jesus said to her, 'I am the resurrection and the life. The one who believes in me will live, even though they die.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "J 11,26", text: "Każdy, kto żyje i wierzy we Mnie, nie umrze na wieki. Wierzysz w to?" },
    en: { reference: "John 11:26", text: "And whoever lives by believing in me will never die. Do you believe this?'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "J 14,6", text: "Odpowiedział mu Jezus: Ja jestem drogą i prawdą, i życiem. Nikt nie przychodzi do Ojca inaczej jak tylko przeze Mnie." },
    en: { reference: "John 14:6", text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Dz 4,12", text: "I nie ma w żadnym innym zbawienia, gdyż nie dano ludziom pod niebem żadnego innego imienia, w którym moglibyśmy być zbawieni." },
    en: { reference: "Acts 4:12", text: "Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Dz 16,31", text: "Uwierz w Jahwe Jezusa - odpowiedzieli mu - a zbawisz siebie i swój dom." },
    en: { reference: "Acts 16:31", text: "They replied, 'Believe in the Lord Jesus, and you will be saved—you and your household.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Iz 53,5", text: "Lecz On był przebity za nasze grzechy, zdruzgotany za nasze winy. Chłosta zbawienna dla nas spadła na Niego, a w Jego ranach jest nasze zdrowie." },
    en: { reference: "Isaiah 53:5", text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Iz 53,6", text: "Wszyscyśmy pobłądzili jak owce, każdy z nas obrócił się ku własnej drodze, a Jahwe obarczył Go winami nas wszystkich." },
    en: { reference: "Isaiah 53:6", text: "We all, like sheep, have gone astray, each of us has turned to our own way; and the Lord has laid on him the iniquity of us all." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 P 2,24", text: "On sam, w swoim ciele poniósł nasze grzechy na drzewo, abyśmy przestali być uczestnikami grzechów, a żyli dla sprawiedliwości - Krwią Jego ran zostaliście uzdrowieni." },
    en: { reference: "1 Peter 2:24", text: "'He himself bore our sins' in his body on the cross, so that we might die to sins and live for righteousness; 'by his wounds you have been healed.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 P 3,18", text: "Chrystus bowiem raz umarł za grzechy, sprawiedliwy za niesprawiedliwych, aby was do Boga przyprowadzić." },
    en: { reference: "1 Peter 3:18", text: "For Christ also suffered once for sins, the righteous for the unrighteous, to bring you to God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "2 Kor 5,17", text: "Jeżeli więc ktoś pozostaje w Chrystusie, jest nowym stworzeniem. To, co dawne, minęło, a oto wszystko stało się nowe." },
    en: { reference: "2 Corinthians 5:17", text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "2 Kor 5,21", text: "On to dla nas grzechem uczynił Tego, który nie znał grzechu, abyśmy się stali w Nim sprawiedliwością Bożą." },
    en: { reference: "2 Corinthians 5:21", text: "God made him who had no sin to be sin for us, so that in him we might become the righteousness of God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ga 2,20", text: "Razem z Chrystusem zostałem przybity do krzyża. Teraz zaś już nie ja żyję, lecz żyje we mnie Chrystus." },
    en: { reference: "Galatians 2:20", text: "I have been crucified with Christ and I no longer live, but Christ lives in me." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Flp 3,8", text: "I owszem, wszystko uznaję za stratę ze względu na najwyższą wartość poznania Chrystusa Jezusa, Jahwe mojego." },
    en: { reference: "Philippians 3:8", text: "What is more, I consider everything a loss because of the surpassing worth of knowing Christ Jesus my Lord." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Flp 3,9", text: "I znalezienia się w Nim - nie z moją sprawiedliwością, pochodzącą z Prawa, lecz z tą, która się bierze z wiary w Chrystusa." },
    en: { reference: "Philippians 3:9", text: "And be found in him, not having a righteousness of my own that comes from the law, but that which is through faith in Christ." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Kol 1,13", text: "On to uwolnił nas spod władzy ciemności i przeniósł do królestwa swego umiłowanego Syna." },
    en: { reference: "Colossians 1:13", text: "For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Kol 1,14", text: "W którym mamy odkupienie - odpuszczenie grzechów." },
    en: { reference: "Colossians 1:14", text: "In whom we have redemption, the forgiveness of sins." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Kol 2,13", text: "I was, umarłych na skutek występków i nieobrzezania waszego grzesznego ciała, razem z Nim ożywił. Darował nam wszystkie występki." },
    en: { reference: "Colossians 2:13", text: "When you were dead in your sins and in the uncircumcision of your flesh, God made you alive with Christ. He forgave us all our sins." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Kol 2,14", text: "Skreślił zapis dłużny obciążający nas nakazami, który był nam przeciwny, i usunął go z drogi, przygwoździwszy do krzyża." },
    en: { reference: "Colossians 2:14", text: "Having canceled the charge of our legal indebtedness, which stood against us and condemned us; he has taken it away, nailing it to the cross." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Hbr 7,25", text: "Przeto i zbawiać na wieki może tych, którzy przez Niego przystępują do Boga, bo zawsze żyje, aby się wstawiać za nimi." },
    en: { reference: "Hebrews 7:25", text: "Therefore he is able to save completely those who come to God through him, because he always lives to intercede for them." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Hbr 9,12", text: "Nie przez krew kozłów i cielców, lecz przez własną krew wszedł raz na zawsze do Miejsca Świętego, zdobywszy wieczne odkupienie." },
    en: { reference: "Hebrews 9:12", text: "He did not enter by means of the blood of goats and calves; but he entered the Most Holy Place once for all by his own blood, thus obtaining eternal redemption." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Hbr 9,28", text: "Tak Chrystus raz jeden był ofiarowany dla zgładzenia grzechów wielu, drugi raz ukaże się nie ze względu na grzech, lecz dla zbawienia tych, którzy Go oczekują." },
    en: { reference: "Hebrews 9:28", text: "So Christ was sacrificed once to take away the sins of many; and he will appear a second time, not to bear sin, but to bring salvation to those who are waiting for him." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Hbr 10,10", text: "Na mocy tej woli jesteśmy uświęceni przez ofiarę ciała Jezusa Chrystusa raz na zawsze." },
    en: { reference: "Hebrews 10:10", text: "And by that will, we have been made holy through the sacrifice of the body of Jesus Christ once for all." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Hbr 10,14", text: "Jedną bowiem ofiarą udoskonalił na wieki tych, którzy są uświęcani." },
    en: { reference: "Hebrews 10:14", text: "For by one sacrifice he has made perfect forever those who are being made holy." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 P 1,18", text: "Wiecie bowiem, że z waszego, odziedziczonego po przodkach, złego postępowania zostaliście wykupieni nie czymś przemijającym, srebrem lub złotem." },
    en: { reference: "1 Peter 1:18", text: "For you know that it was not with perishable things such as silver or gold that you were redeemed from the empty way of life handed down to you from your ancestors." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 P 1,19", text: "Ale drogocenną krwią Chrystusa, jako baranka niepokalanego i bez zmazy." },
    en: { reference: "1 Peter 1:19", text: "But with the precious blood of Christ, a lamb without blemish or defect." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 P 1,23", text: "Jesteście bowiem ponownie do życia powołani nie z ziarna zniszczalnego, ale z niezniszczalnego, przez słowo Boże, które jest żywe i trwa." },
    en: { reference: "1 Peter 1:23", text: "For you have been born again, not of perishable seed, but of imperishable, through the living and enduring word of God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 2,1", text: "Dzieci moje, piszę wam to dlatego, żebyście nie grzeszyli. Jeśliby nawet kto zgrzeszył, mamy Rzecznika wobec Ojca - Jezusa Chrystusa sprawiedliwego." },
    en: { reference: "1 John 2:1", text: "My dear children, I write this to you so that you will not sin. But if anybody does sin, we have an advocate with the Father—Jesus Christ, the Righteous One." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 2,2", text: "On bowiem jest ofiarą przebłagalną za nasze grzechy, i nie tylko za nasze, lecz również za grzechy całego świata." },
    en: { reference: "1 John 2:2", text: "He is the atoning sacrifice for our sins, and not only for ours but also for the sins of the whole world." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 3,1", text: "Popatrzcie, jaką miłością obdarzył nas Ojciec: zostaliśmy nazwani dziećmi Bożymi: i rzeczywiście nimi jesteśmy." },
    en: { reference: "1 John 3:1", text: "See what great love the Father has lavished on us, that we should be called children of God! And that is what we are!" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 3,2", text: "Umiłowani, obecnie jesteśmy dziećmi Bożymi, ale jeszcze się nie ujawniło, czym będziemy." },
    en: { reference: "1 John 3:2", text: "Dear friends, now we are children of God, and what we will be has not yet been made known." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 4,9", text: "W tym objawiła się miłość Boga ku nam, że zesłał Syna swego Jednorodzonego na świat, abyśmy życie mieli dzięki Niemu." },
    en: { reference: "1 John 4:9", text: "This is how God showed his love among us: He sent his one and only Son into the world that we might live through him." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "1 J 4,10", text: "W tym przejawia się miłość, że nie my umiłowaliśmy Boga, ale że On sam nas umiłował i posłał Syna swojego jako ofiarę przebłagalną za nasze grzechy." },
    en: { reference: "1 John 4:10", text: "This is love: not that we loved God, but that he loved us and sent his Son as an atoning sacrifice for our sins." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ap 1,5", text: "I od Jezusa Chrystusa, Świadka Wiernego, Pierworodnego umarłych i Władcy królów ziemi. Temu, który nas miłuje i który przez swą krew uwolnił nas od naszych grzechów." },
    en: { reference: "Revelation 1:5", text: "And from Jesus Christ, who is the faithful witness, the firstborn from the dead, and the ruler of the kings of the earth. To him who loves us and has freed us from our sins by his blood." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ap 5,9", text: "Godzien jesteś wziąć księgę i jej pieczęcie otworzyć, bo zostałeś zabity i krwią Twoją nabyłeś dla Boga ludzi z każdego pokolenia, języka, ludu i narodu." },
    en: { reference: "Revelation 5:9", text: "And they sang a new song, saying: 'You are worthy to take the scroll and to open its seals, because you were slain, and with your blood you purchased for God persons from every tribe and language and people and nation.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ap 21,6", text: "I rzekł mi: Stało się. Ja jestem Alfa i Omega, Początek i Koniec. Ja pragnącemu dam pić darmo ze źródła wody życia." },
    en: { reference: "Revelation 21:6", text: "He said to me: 'It is done. I am the Alpha and the Omega, the Beginning and the End. To the thirsty I will give water without cost from the spring of the water of life.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 1,1", text: "Błogosławiony człowiek, który nie idzie za radą występnych, nie staje na drodze grzeszników i nie zasiada w kole szyderców." },
    en: { reference: "Psalm 1:1", text: "Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 1,2", text: "Lecz ma upodobanie w Prawie Jahwe, nad Jego Prawem rozmyśla dniem i nocą." },
    en: { reference: "Psalm 1:2", text: "But whose delight is in the law of the Lord, and who meditates on his law day and night." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 1,3", text: "Jest on jak drzewo zasadzone nad płynącą wodą, które wydaje owoc w swoim czasie, a liście jego nie więdną: co uczyni, pomyślnie wypadnie." },
    en: { reference: "Psalm 1:3", text: "That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither—whatever they do prospers." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 8,2", text: "O Jahwe, nasz Jahwe, jak przedziwne Twe imię po wszystkiej ziemi! Tyś swój majestat wyniósł nad niebiosa." },
    en: { reference: "Psalm 8:1", text: "Lord, our Lord, how majestic is your name in all the earth! You have set your glory in the heavens." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 8,4", text: "Gdy patrzę na Twe niebo, dzieło Twych palców, księżyc i gwiazdy, któreś Ty utwierdził." },
    en: { reference: "Psalm 8:3", text: "When I consider your heavens, the work of your fingers, the moon and the stars, which you have set in place." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 8,5", text: "Czym jest człowiek, że o nim pamiętasz, i czym syn człowieczy, że się nim opiekujesz?" },
    en: { reference: "Psalm 8:4", text: "What is mankind that you are mindful of them, human beings that you care for them?" },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 16,1", text: "Zachowaj mnie, Boże, bo chronię się u Ciebie." },
    en: { reference: "Psalm 16:1", text: "Keep me safe, my God, for in you I take refuge." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 16,2", text: "Mówię do Jahwe: Tyś jest Jahwe moim; nie ma dla mnie dobra poza Tobą." },
    en: { reference: "Psalm 16:2", text: "I say to the Lord, 'You are my Lord; apart from you I have no good thing.'" },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 16,5", text: "Jahwe częścią dziedzictwa i kielicha mego: To Ty mój los zabezpieczasz." },
    en: { reference: "Psalm 16:5", text: "Lord, you alone are my portion and my cup; you make my lot secure." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 16,8", text: "Stawiam sobie Jahwe zawsze przed oczy: nie zachwieję się, bo On jest po mojej prawicy." },
    en: { reference: "Psalm 16:8", text: "I keep my eyes always on the Lord. With him at my right hand, I will not be shaken." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 16,9", text: "Dlatego się cieszy moje serce, dusza raduje, a ciało moje będzie spoczywać bezpiecznie." },
    en: { reference: "Psalm 16:9", text: "Therefore my heart is glad and my tongue rejoices; my body also will rest secure." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 18,2", text: "Miłuję Cię, Jahwe, Mocy moja!" },
    en: { reference: "Psalm 18:1", text: "I love you, Lord, my strength." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 18,3", text: "Jahwe, opoko moja i twierdzo, mój wybawicielu; Boże mój, skało moja, na którą się chronię; tarczo moja, mocy zbawienia mego i moja forteco!" },
    en: { reference: "Psalm 18:2", text: "The Lord is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge, my shield and the horn of my salvation, my stronghold." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 18,31", text: "Droga Boża jest nieskazitelna, słowo Jahwe w ogniu wypróbowane; On tarczą dla wszystkich, którzy się u Niego chronią." },
    en: { reference: "Psalm 18:30", text: "As for God, his way is perfect: The Lord’s word is flawless; he shields all who take refuge in him." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 18,32", text: "Bo któż jest Bogiem prócz Jahwe? Lub któż jest skałą prócz Boga naszego?" },
    en: { reference: "Psalm 18:31", text: "For who is God besides the Lord? And who is the Rock except our God?" },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 18,33", text: "Bóg, który mnie mocą przepasuje i czyni moją drogę nieskazitelną." },
    en: { reference: "Psalm 18:32", text: "It is God who arms me with strength and treads my way smooth." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 19,8", text: "Prawo Jahwe jest doskonałe - pokrzepia duszę; świadectwo Jahwe jest niezawodne - poucza prostaczka." },
    en: { reference: "Psalm 19:7", text: "The law of the Lord is perfect, refreshing the soul. The statutes of the Lord are trustworthy, making wise the simple." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 19,9", text: "Nakazy Jahwe są słuszne - radują serce; przykazanie Jahwe jest jasne - oświeca oczy." },
    en: { reference: "Psalm 19:8", text: "The precepts of the Lord are right, giving joy to the heart. The commands of the Lord are radiant, giving light to the eyes." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 19,10", text: "Bojaźń Pańska jest czysta, trwa na wieki; wyroki Jahwe są prawdziwe, wszystkie razem sprawiedliwe." },
    en: { reference: "Psalm 19:9", text: "The fear of the Lord is pure, enduring forever. The decrees of the Lord are firm, and all of them are righteous." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 19,15", text: "Niech znajdą uznanie u Ciebie słowa ust moich i myśli mego serca, Jahwe, moja Opoko i mój Odkupicielu!" },
    en: { reference: "Psalm 19:14", text: "May these words of my mouth and this meditation of my heart be pleasing in your sight, Lord, my Rock and my Redeemer." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 20,8", text: "Jedni ufają rydwanom, inni koniom, a my wzywamy imienia Jahwe, Boga naszego." },
    en: { reference: "Psalm 20:7", text: "Some trust in chariots and some in horses, but we trust in the name of the Lord our God." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 22,4", text: "A przecież Ty mieszkasz w świątyni, Chwało Izraela!" },
    en: { reference: "Psalm 22:3", text: "Yet you are enthroned as the Holy One; you are the one Israel praises." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 24,1", text: "Do Jahwe należy ziemia i wszystko, co ją napełnia, świat i jego mieszkańcy." },
    en: { reference: "Psalm 24:1", text: "The earth is the Lord’s, and everything in it, the world, and all who live in it." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 24,3", text: "Kto wstąpi na górę Jahwe? Kto stanie w Jego świętym miejscu?" },
    en: { reference: "Psalm 24:3", text: "Who may ascend the mountain of the Lord? Who may stand in his holy place?" },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 24,4", text: "Człowiek rąk nieskalanych i czystego serca, który nie skłonił swej duszy ku marnościom i nie przysięgał fałszywie." },
    en: { reference: "Psalm 24:4", text: "The one who has clean hands and a pure heart, who does not trust in an idol or swear by a false god." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 25,1", text: "Ku Tobie, Jahwe, wznoszę moją duszę." },
    en: { reference: "Psalm 25:1", text: "In you, Lord my God, I put my trust." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 25,4", text: "Daj mi poznać Twoje drogi, Jahwe, naucz mnie Twoich ścieżek!" },
    en: { reference: "Psalm 25:4", text: "Show me your ways, Lord, teach me your paths." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 25,5", text: "Prowadź mnie w Twojej prawdzie i pouczaj, bo Ty jesteś Bogiem, moim Zbawcą, w Tobie mam zawsze nadzieję." },
    en: { reference: "Psalm 25:5", text: "Guide me in your truth and teach me, for you are God my Savior, and my hope is in you all day long." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 25,10", text: "Wszystkie ścieżki Jahwe to łaska i wierność dla tych, co strzegą Jego przymierza i Jego przykazań." },
    en: { reference: "Psalm 25:10", text: "All the ways of the Lord are loving and faithful toward those who keep the demands of his covenant and his testimonies." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 25,14", text: "Jahwe powierza swe zamiary tym, którzy się Go boją, i objawia im swoje przymierze." },
    en: { reference: "Psalm 25:14", text: "The Lord confides in those who fear him; he makes his covenant known to them." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 27,4", text: "O jedno proszę Jahwe, o to zabiegam: abym mógł mieszkać w domu Jahwe przez wszystkie dni mego życia." },
    en: { reference: "Psalm 27:4", text: "One thing I ask from the Lord, this only do I seek: that I may dwell in the house of the Lord all the days of my life." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 27,14", text: "Miej nadzieję w Jahwe, bądź mężny, niech serce twe będzie mocne, miej nadzieję w Jahwe!" },
    en: { reference: "Psalm 27:14", text: "Wait for the Lord; be strong and take heart and wait for the Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 28,7", text: "Jahwe moją mocą i tarczą! Moje serce Mu zaufało: doznałem pomocy, więc moje serce się cieszy i pieśnią moją Go sławię." },
    en: { reference: "Psalm 28:7", text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me. My heart leaps for joy, and with my song I praise him." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 30,5", text: "Śpiewajcie Jahwe, wy, Jego czciciele, i wysławiajcie pamiątkę Jego świętości!" },
    en: { reference: "Psalm 30:4", text: "Sing the praises of the Lord, you his faithful people; praise his holy name." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 30,6", text: "Gniew Jego bowiem trwa tylko chwilę, a Jego łaskawość przez całe życie. Wieczorem gości płacz, a rano wesele." },
    en: { reference: "Psalm 30:5", text: "For his anger lasts only a moment, but his favor lasts a lifetime; weeping may stay for the night, but rejoicing comes in the morning." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 30,12", text: "Zamieniłeś mój lament w radosny taniec; zdjąłeś ze mnie wór pokutny i przepasałeś mnie radością." },
    en: { reference: "Psalm 30:11", text: "You turned my wailing into dancing; you removed my sackcloth and clothed me with joy." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 31,15", text: "Ja zaś ufam Tobie, Jahwe, mówię: Ty jesteś moim Bogiem." },
    en: { reference: "Psalm 31:14", text: "But I trust in you, Lord; I say, 'You are my God.'" },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 31,20", text: "Jakże jest wielka Twoja dobroć, którą zachowujesz dla tych, co się Go boją." },
    en: { reference: "Psalm 31:19", text: "How abundant are the good things that you have stored up for those who fear you." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 31,25", text: "Bądźcie mężni i niech serce wasze będzie mocne, wszyscy, którzy macie nadzieję w Jahwe!" },
    en: { reference: "Psalm 31:24", text: "Be strong and take heart, all you who hope in the Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 32,1", text: "Szczęśliwy ten, komu odpuszczona została nieprawość, którego grzech został zakryty." },
    en: { reference: "Psalm 32:1", text: "Blessed is the one whose transgressions are forgiven, whose sins are covered." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 32,11", text: "Cieszcie się w Jahwe i weselcie, sprawiedliwi, wykrzykujcie radośnie, wszyscy prawego serca!" },
    en: { reference: "Psalm 32:11", text: "Rejoice in the Lord and be glad, you righteous; sing, all you who are upright in heart!" },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 33,1", text: "Radośnie wykrzykujcie na cześć Jahwe, sprawiedliwi: prawym przystoi pieśń chwały." },
    en: { reference: "Psalm 33:1", text: "Sing joyfully to the Lord, you righteous; it is fitting for the upright to praise him." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 33,4", text: "Bo słowo Jahwe jest prawe, a każde Jego dzieło godne zaufania." },
    en: { reference: "Psalm 33:4", text: "For the word of the Lord is right and true; he is faithful in all he does." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 33,5", text: "On miłuje prawo i sprawiedliwość: ziemia jest pełna łaskawości Pańskiej." },
    en: { reference: "Psalm 33:5", text: "The Lord loves righteousness and justice; the earth is full of his unfailing love." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 33,11", text: "Zamiar Jahwe trwa na wieki; zamysły Jego serca - przez wszystkie pokolenia." },
    en: { reference: "Psalm 33:11", text: "But the plans of the Lord stand firm forever, the purposes of his heart through all generations." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 33,12", text: "Szczęśliwy naród, którego Bogiem jest Jahwe - lud, który On wybrał sobie na dziedzictwo." },
    en: { reference: "Psalm 33:12", text: "Blessed is the nation whose God is the Lord, the people he chose for his inheritance." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 33,18", text: "Oto oko Jahwe nad tymi, którzy się Go boją, nad tymi, którzy ufają Jego łasce." },
    en: { reference: "Psalm 33:18", text: "But the eyes of the Lord are on those who fear him, on those whose hope is in his unfailing love." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 33,20", text: "Dusza nasza wyczekuje Jahwe, On jest naszą pomocą i tarczą." },
    en: { reference: "Psalm 33:20", text: "We wait in hope for the Lord; he is our help and our shield." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 33,21", text: "W Nim bowiem raduje się nasze serce, ufamy Jego świętemu imieniu." },
    en: { reference: "Psalm 33:21", text: "In him our hearts rejoice, for we trust in his holy name." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 33,22", text: "Niech Twoja łaska, Jahwe, będzie nad nami, według nadziei, którą pokładamy w Tobie." },
    en: { reference: "Psalm 33:22", text: "May your unfailing love be with us, Lord, even as we put our hope in you." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,2", text: "Chcę błogosławić Jahwe w każdym czasie, na ustach moich zawsze Jego chwała." },
    en: { reference: "Psalm 34:1", text: "I will extol the Lord at all times; his praise will always be on my lips." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,4", text: "Wysławiajcie ze mną Jahwe, wspólnie wywyższajmy Jego imię!" },
    en: { reference: "Psalm 34:3", text: "Glorify the Lord with me; let us exalt his name together." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,5", text: "Szukałem Jahwe, a On mnie wysłuchał i uwolnił od wszelkiej trwogi." },
    en: { reference: "Psalm 34:4", text: "I sought the Lord, and he answered me; he delivered me from all my fears." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,6", text: "Spójrzcie na Niego, a rozpromienicie się radością, a oblicza wasze nie zapłoną wstydem." },
    en: { reference: "Psalm 34:5", text: "Those who look to him are radiant; their faces are never covered with shame." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,8", text: "Anioł Jahwe obozem otacza tych, co się Go boją, i ocala ich." },
    en: { reference: "Psalm 34:7", text: "The angel of the Lord encamps around those who fear him, and he delivers them." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,9", text: "Skosztujcie i zobaczcie, jak dobry jest Jahwe, szczęśliwy człowiek, który się do Niego ucieka." },
    en: { reference: "Psalm 34:8", text: "Taste and see that the Lord is good; blessed is the one who takes refuge in him." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,11", text: "Lwy mogą cierpieć niedostatek i głód, lecz szukającym Jahwe nie zabraknie żadnego dobra." },
    en: { reference: "Psalm 34:10", text: "The lions may grow weak and hungry, but those who seek the Lord lack no good thing." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,16", text: "Oczy Jahwe zwrócone są na sprawiedliwych, a Jego uszy na ich wołanie." },
    en: { reference: "Psalm 34:15", text: "The eyes of the Lord are on the righteous, and his ears are attentive to their cry." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,18", text: "Jahwe słyszy tych, co Go wzywają, i uwalnia ich od wszelkiej udręki." },
    en: { reference: "Psalm 34:17", text: "The righteous cry out, and the Lord hears them; he delivers them from all their troubles." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,19", text: "Jahwe jest blisko skruszonych w sercu i wybawia złamanych na duchu." },
    en: { reference: "Psalm 34:18", text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,20", text: "Liczne są nieszczęścia sprawiedliwego, lecz ze wszystkich Jahwe go wybawia." },
    en: { reference: "Psalm 34:19", text: "The righteous person may have many troubles, but the Lord delivers him from them all." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 34,23", text: "Jahwe uwalnia dusze swoich sług, nie zazna kary, kto się do Niego ucieka." },
    en: { reference: "Psalm 34:22", text: "The Lord will rescue his servants; no one who takes refuge in him will be condemned." },
    category: 'worship'
  },
  {
    pl: { reference: "Ap 22,17", text: "A Duch i Oblubienica mówią: Przyjdź! A kto słyszy, niech powie: Przyjdź! I kto odczuwa pragnienie, niech przyjdzie, kto chce, niech wody życia darmo zaczerpnie." },
    en: { reference: "Revelation 22:17", text: "The Spirit and the bride say, 'Come!' And let the one who hears say, 'Come!' Let the one who is thirsty come; and let the one who wishes take the free gift of the water of life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 103,1", text: "Błogosław, duszo moja, Jahwe, i całe moje wnętrze - święte imię Jego!" },
    en: { reference: "Psalm 103:1", text: "Praise the Lord, my soul; all my inmost being, praise his holy name." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 145,1-2", text: "Chcę Cię wywyższać, Boże mój, Królu, i błogosławić imię Twe na zawsze i na wieki. Każdego dnia będę Cię błogosławił." },
    en: { reference: "Psalm 145:1-2", text: "I will exalt you, my God the King; I will praise your name for ever and ever. Every day I will praise you." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 63,4-5", text: "Ponieważ łaska Twoja lepsza jest od życia, moje wargi będą Cię sławić. Tak będę Cię błogosławił w moim życiu: w imię Twoje ręce moje wzniosę." },
    en: { reference: "Psalm 63:3-4", text: "Because your love is better than life, my lips will glorify you. I will praise you as long as I live, and in your name I will lift up my hands." },
    category: 'worship'
  },
  {
    pl: { reference: "1 Krn 16,23", text: "Śpiewajcie Jahwe, wszystkie ziemie, z dnia na dzień głoście Jego zbawienie!" },
    en: { reference: "1 Chronicles 16:23", text: "Sing to the Lord, all the earth; proclaim his salvation day after day." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 113,3", text: "Od wschodu słońca aż po zachód jego niech imię Jahwe będzie pochwalone!" },
    en: { reference: "Psalm 113:3", text: "From the rising of the sun to the place where it sets, the name of the Lord is to be praised." },
    category: 'worship'
  },
  // ... and so on up to 365. I will add more to provide a good variety.
  {
    pl: { reference: "Iz 43,1", text: "Nie lękaj się, bo cię wykupiłem, wezwałem cię po imieniu; tyś moim!" },
    en: { reference: "Isaiah 43:1", text: "Do not fear, for I have redeemed you; I have summoned you by name; you are mine." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 23,1", text: "Jahwe jest pasterzem moim, niczego mi nie braknie." },
    en: { reference: "Psalm 23:1", text: "The Lord is my shepherd, I lack nothing." },
    category: 'worship'
  },
  {
    pl: { reference: "Flp 4,13", text: "Wszystko mogę w Tym, który mnie umacnia." },
    en: { reference: "Philippians 4:13", text: "I can do all this through him who gives me strength." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 46,2", text: "Bóg jest dla nas ucieczką i mocą: najpewniejszą pomocą w trudnościach." },
    en: { reference: "Psalm 46:1", text: "God is our refuge and strength, an ever-present help in trouble." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 24,14", text: "A ta Ewangelia o królestwie będzie głoszona po całej ziemi, na świadectwo wszystkim narodom." },
    en: { reference: "Matthew 24:14", text: "And this gospel of the kingdom will be preached in the whole world as a testimony to all nations." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 119,105", text: "Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce." },
    en: { reference: "Psalm 119:105", text: "Your word is a lamp for my feet, a light on my path." },
    category: 'worship'
  },
  {
    pl: { reference: "J 8,12", text: "Ja jestem światłością świata. Kto idzie za Mną, nie będzie chodził w ciemności, lecz będzie miał światło życia." },
    en: { reference: "John 8:12", text: "I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 27,1", text: "Jahwe światłem i zbawieniem moim: kogo mam się lękać? Jahwe obroną mojego życia: przed kim mam się trwożyć?" },
    en: { reference: "Psalm 27:1", text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?" },
    category: 'worship'
  },
  {
    pl: { reference: "Flp 4,4", text: "Radujcie się zawsze w Jahwe; jeszcze raz powtarzam: radujcie się!" },
    en: { reference: "Philippians 4:4", text: "Rejoice in the Lord always. I will say it again: Rejoice!" },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 28,20", text: "A oto Ja jestem z wami przez wszystkie dni, aż do skończenia świata." },
    en: { reference: "Matthew 28:20", text: "And surely I am with you always, to the very end of the age." },
    category: 'missionary'
  },
  {
    pl: { reference: "J 15,5", text: "Ja jestem krzewem winnym, wy - latoroślami. Kto trwa we Mnie, a Ja w nim, ten przynosi owoc obfity, ponieważ bez Mnie nic nie możecie uczynić." },
    en: { reference: "John 15:5", text: "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 121,1-2", text: "Wznoszę swe oczy ku górom: Skądże nadejdzie mi pomoc? Pomoc mi przyjdzie od Jahwe, co stworzył niebo i ziemię." },
    en: { reference: "Psalm 121:1-2", text: "I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord, the Maker of heaven and earth." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 8,28", text: "Wiemy też, że Bóg z tymi, którzy Go miłują, współdziała we wszystkim dla ich dobra." },
    en: { reference: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 139,14", text: "Dziękuję Ci, że mnie stworzyłeś tak cudownie, godne podziwu są Twoje dzieła." },
    en: { reference: "Psalm 139:14", text: "I praise you because I am fearfully and wonderfully made; your works are wonderful." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 6,33", text: "Starajcie się naprzód o królestwo Boga i o Jego sprawiedliwość, a to wszystko będzie wam dodane." },
    en: { reference: "Matthew 6:33", text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 37,4", text: "Raduj się w Jahwe, a On spełni pragnienia twego serca." },
    en: { reference: "Psalm 37:4", text: "Take delight in the Lord, and he will give you the desires of your heart." },
    category: 'worship'
  },
  {
    pl: { reference: "Joz 1,9", text: "Czyż ci nie rozkazałem: Bądź mężny i mocny? Nie lękaj się i nie trwóż się, bo Jahwe, Bóg twój, będzie z tobą wszędzie, gdziekolwiek pójdziesz." },
    en: { reference: "Joshua 1:9", text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 118,24", text: "Oto dzień, który Jahwe uczynił: radujmy się w nim i weselmy!" },
    en: { reference: "Psalm 118:24", text: "The Lord has done it this very day; let us rejoice today and be glad." },
    category: 'worship'
  },
  {
    pl: { reference: "1 J 4,19", text: "My miłujemy Boga, ponieważ On sam pierwszy nas umiłował." },
    en: { reference: "1 John 4:19", text: "We love because he first loved us." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 147,3", text: "On leczy złamanych na duchu i przewiązuje ich rany." },
    en: { reference: "Psalm 147:3", text: "He heals the brokenhearted and binds up their wounds." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 7,7", text: "Proście, a będzie wam dane; szukajcie, a znajdziecie; kołaczcie, a otworzą wam." },
    en: { reference: "Matthew 7:7", text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 19,2", text: "Niebiosa głoszą chwałę Boga, dzieło rąk Jego obwieszcza nieboskłon." },
    en: { reference: "Psalm 19:1", text: "The heavens declare the glory of God; the skies proclaim the work of his hands." },
    category: 'worship'
  },
  {
    pl: { reference: "Dz 4,12", text: "I nie ma w żadnym innym zbawienia, gdyż nie dano ludziom pod niebem żadnego innego imienia, w którym moglibyśmy być zbawieni." },
    en: { reference: "Acts 4:12", text: "Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 107,1", text: "Wysławiajcie Jahwe, bo jest dobry, bo łaska Jego trwa na wieki." },
    en: { reference: "Psalm 107:1", text: "Give thanks to the Lord, for he is good; his love endures forever." },
    category: 'worship'
  },
  {
    pl: { reference: "Iz 40,31", text: "Lecz ci, co zaufali Jahwe, odzyskują siły, otrzymują skrzydła jak orły: biegną bez zmęczenia, idą bez znużenia." },
    en: { reference: "Isaiah 40:31", text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 16,11", text: "Ukażesz mi ścieżkę życia, pełnię radości u Ciebie, rozkosze na wieki po Twojej prawicy." },
    en: { reference: "Psalm 16:11", text: "You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 5,16", text: "Tak niech świeci wasze światło przed ludźmi, aby widzieli wasze dobre uczynki i chwalili Ojca waszego, który jest w niebie." },
    en: { reference: "Matthew 5:16", text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 32,8", text: "Pouczę cię i wskażę drogę, którą masz iść; będę cię radził, utrwalając na tobie moje oko." },
    en: { reference: "Psalm 32:8", text: "I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 145,18", text: "Jahwe jest blisko wszystkich, którzy Go wzywają, wszystkich wzywających Go szczerze." },
    en: { reference: "Psalm 145:18", text: "The Lord is near to all who call on him, to all who call on him in truth." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 25,40", text: "Wszystko, co uczyniliście jednemu z tych braci moich najmniejszych, Mnieście uczynili." },
    en: { reference: "Matthew 25:40", text: "Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 51,12", text: "Stwórz, o Boże, we mnie serce czyste i odnów w mojej piersi ducha niezwyciężonego!" },
    en: { reference: "Psalm 51:10", text: "Create in me a pure heart, O God, and renew a steadfast spirit within me." },
    category: 'worship'
  },
  {
    pl: { reference: "Flp 2,10-11", text: "Aby na imię Jezusa zgięło się każde kolano istot niebieskich i ziemskich, i podziemnych. I aby wszelki język wyznał, że Jezus Chrystus jest JAHWE." },
    en: { reference: "Philippians 2:10-11", text: "That at the name of Jesus every knee should bow, in heaven and on earth and under the earth, and every tongue acknowledge that Jesus Christ is Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 84,11", text: "Dzień jeden w Twoich przybytkach lepszy jest niż innych tysiące." },
    en: { reference: "Psalm 84:10", text: "Better is one day in your courts than a thousand elsewhere." },
    category: 'worship'
  },
  {
    pl: { reference: "1 Kor 16,14", text: "Wszystkie wasze sprawy niech się dokonują w miłości!" },
    en: { reference: "1 Corinthians 16:14", text: "Do everything in love." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 119,11", text: "W sercu swym przechowuję Twą mowę, by nie zgrzeszyć przeciw Tobie." },
    en: { reference: "Psalm 119:11", text: "I have hidden your word in my heart that I might not sin against you." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 4,19", text: "I rzekł do nich: Pójdźcie za Mną, a uczynię was rybakami ludzi." },
    en: { reference: "Matthew 4:19", text: "'Come, follow me,' Jesus said, 'and I will send you out to fish for people.'" },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 136,1", text: "Dziękujcie Jahwe, bo jest dobry, bo Jego łaska trwa na wieki." },
    en: { reference: "Psalm 136:1", text: "Give thanks to the Lord, for he is good. His love endures forever." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 12,2", text: "Nie bierzcie więc wzoru z tego świata, lecz przemieniajcie się przez odnawianie umysłu." },
    en: { reference: "Romans 12:2", text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 146,2", text: "Chcę chwalić Jahwe, jak długo żyć będę; chcę śpiewać mojemu Bogu, póki istnieję." },
    en: { reference: "Psalm 146:2", text: "I will praise the Lord all my life; I will sing praise to my God as long as I live." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 10,8", text: "Darmo otrzymaliście, darmo dawajcie!" },
    en: { reference: "Matthew 10:8", text: "Freely you have received; freely give." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 96,1", text: "Śpiewajcie Jahwe pieśń nową, śpiewaj Jahwe, cała ziemio!" },
    en: { reference: "Psalm 96:1", text: "Sing to the Lord a new song; sing to the Lord, all the earth." },
    category: 'worship'
  },
  {
    pl: { reference: "J 15,13", text: "Nikt nie ma większej miłości od tej, gdy ktoś życie swoje oddaje za przyjaciół swoich." },
    en: { reference: "John 15:13", text: "Greater love has no one than this: to lay down one’s life for one’s friends." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 115,1", text: "Nie nam, Jahwe, nie nam, lecz Twemu imieniu daj chwałę za Twoją łaskę i za Twą wierność!" },
    en: { reference: "Psalm 115:1", text: "Not to us, Lord, not to us but to your name be the glory, because of your love and faithfulness." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 22,37", text: "Będziesz miłował Jahwe Boga swego całym swoim sercem, całą swoją duszą i całym swoim umysłem." },
    en: { reference: "Matthew 22:37", text: "Love the Lord your God with all your heart and with all your soul and with all your mind." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 148,1", text: "Alleluja. Chwalcie Jahwe z niebios, chwalcie Go na wysokościach!" },
    en: { reference: "Psalm 148:1", text: "Praise the Lord. Praise the Lord from the heavens; praise him in the heights above." },
    category: 'worship'
  },
  {
    pl: { reference: "Dz 20,35", text: "Więcej szczęścia jest w dawaniu aniżeli w braniu." },
    en: { reference: "Acts 20:35", text: "It is more blessed to give than to receive." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 29,2", text: "Oddajcie Jahwe chwałę Jego imienia, na świętym dziedzińcu uwielbiajcie Jahwe!" },
    en: { reference: "Psalm 29:2", text: "Ascribe to the Lord the glory due his name; worship the Lord in the splendor of his holiness." },
    category: 'worship'
  },
  {
    pl: { reference: "1 J 4,8", text: "Kto nie miłuje, nie zna Boga, bo Bóg jest miłością." },
    en: { reference: "1 John 4:8", text: "Whoever does not love does not know God, because God is love." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 66,1-2", text: "Z radością sławcie Boga, wszystkie ziemie, opiewajcie chwałę Jego imienia, cześć Mu oddajcie wspaniałą!" },
    en: { reference: "Psalm 66:1-2", text: "Shout for joy to God, all the earth! Sing the glory of his name; make his praise glorious." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 5,13", text: "Wy jesteście solą ziemi. Lecz jeśli sól utraci swój smak, czymże ją posolić?" },
    en: { reference: "Matthew 5:13", text: "You are the salt of the earth. But if the salt loses its saltiness, how can it be made salty again?" },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 105,1", text: "Sławcie Jahwe, wzywajcie Jego imienia, głoście Jego dzieła wśród narodów!" },
    en: { reference: "Psalm 105:1", text: "Give praise to the Lord, proclaim his name; make known among the nations what he has done." },
    category: 'worship'
  },
  {
    pl: { reference: "J 16,33", text: "Na świecie doznacie ucisku, ale miejcie odwagę: Ja zwyciężyłem świat." },
    en: { reference: "John 16:33", text: "In this world you will have trouble. But take heart! I have overcome the world." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 117,1", text: "Chwalcie Jahwe, wszystkie narody, wysławiajcie Go, wszystkie ludy!" },
    en: { reference: "Psalm 117:1", text: "Praise the Lord, all you nations; extol him, all you peoples." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 10,32", text: "Do każdego więc, który się przyzna do Mnie przed ludźmi, przyznam się i Ja przed moim Ojcem, który jest w niebie." },
    en: { reference: "Matthew 10:32", text: "Whoever acknowledges me before others, I will also acknowledge before my Father in heaven." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 149,1", text: "Alleluja. Śpiewajcie Jahwe pieśń nową, chwała Jego niech brzmi w zgromadzeniu świętych." },
    en: { reference: "Psalm 149:1", text: "Praise the Lord. Sing to the Lord a new song, his praise in the assembly of his faithful people." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 1,16", text: "Bo ja nie wstydzę się Ewangelii, jest ona bowiem mocą Bożą ku zbawieniu dla każdego wierzącego." },
    en: { reference: "Romans 1:16", text: "For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 135,1", text: "Alleluja. Chwalcie imię Jahwe, chwalcie, słudzy Jahwe." },
    en: { reference: "Psalm 135:1", text: "Praise the Lord. Praise the name of the Lord; praise him, you servants of the Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 28,18", text: "Wtedy Jezus podszedł do nich i przemówił tymi słowami: Dana Mi jest wszelka władza w niebie i na ziemi." },
    en: { reference: "Matthew 28:18", text: "Then Jesus came to them and said, 'All authority in heaven and on earth has been given to me.'" },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 104,1", text: "Błogosław, duszo moja, Jahwe! O Jahwe, Boże mój, Ty jesteś bardzo wielki!" },
    en: { reference: "Psalm 104:1", text: "Praise the Lord, my soul. Lord my God, you are very great." },
    category: 'worship'
  },
  {
    pl: { reference: "J 11,25", text: "Powiedział do niej Jezus: Ja jestem zmartwychwstaniem i życiem. Kto we Mnie wierzy, choćby i umarł, żyć będzie." },
    en: { reference: "John 11:25", text: "Jesus said to her, 'I am the resurrection and the life. The one who believes in me will live, even though they die.'" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 98,1", text: "Śpiewajcie Jahwe pieśń nową, bo cuda uczynił." },
    en: { reference: "Psalm 98:1", text: "Sing to the Lord a new song, for he has done marvelous things." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 20,28", text: "Syn Człowieczy nie przyszedł, aby Mu służono, lecz aby służyć i dać swoje życie na okup za wielu." },
    en: { reference: "Matthew 20:28", text: "The Son of Man did not come to be served, but to serve, and to give his life as a ransom for many." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 111,1", text: "Alleluja. Z całego serca chcę chwalić Jahwe w radzie sprawiedliwych i w zgromadzeniu." },
    en: { reference: "Psalm 111:1", text: "Praise the Lord. I will extol the Lord with all my heart in the council of the upright and in the assembly." },
    category: 'worship'
  },
  {
    pl: { reference: "1 Kor 1,18", text: "Nauka bowiem krzyża głupstwem jest dla tych, co idą na zatracenie, mocą Bożą zaś dla nas, którzy dostępujemy zbawienia." },
    en: { reference: "1 Corinthians 1:18", text: "For the message of the cross is foolishness to those who are perishing, but to us who are being saved it is the power of God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 144,1", text: "Błogosławiony Jahwe - Skała moja, On zaprawia moje ręce do walki, moje palce do bitwy." },
    en: { reference: "Psalm 144:1", text: "Praise be to the Lord my Rock, who trains my hands for war, my fitness for battle." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 13,38", text: "Rolą jest świat, dobrym nasieniem są synowie królestwa." },
    en: { reference: "Matthew 13:38", text: "The field is the world, and the good seed stands for the people of the kingdom." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 108,2", text: "Serce moje jest mocne, Boże, będę śpiewał i grał. Zbudź się, duszo moja!" },
    en: { reference: "Psalm 108:1", text: "My heart, O God, is steadfast; I will sing and make music with all my soul." },
    category: 'worship'
  },
  {
    pl: { reference: "J 3,36", text: "Kto wierzy w Syna, ma życie wieczne; kto zaś nie wierzy Synowi, nie ujrzy życia." },
    en: { reference: "John 3:36", text: "Whoever believes in the Son has eternal life, but whoever rejects the Son will not see life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 116,12-13", text: "Czym się Jahwe odpłacę za wszystko, co mi wyświadczył? Podniosę kielich zbawienia i wezwę imienia Jahwe." },
    en: { reference: "Psalm 116:12-13", text: "What shall I return to the Lord for all his goodness to me? I will lift up the cup of salvation and call on the name of the Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 21,43", text: "Dlatego powiadam wam: Królestwo Boże będzie wam zabrane, a dane narodowi, który wyda jego owoce." },
    en: { reference: "Matthew 21:43", text: "Therefore I tell you that the kingdom of God will be taken away from you and given to a people who will produce its fruit." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 138,1", text: "Będę Cię sławił z całego serca, będę Ci śpiewał wobec aniołów." },
    en: { reference: "Psalm 138:1", text: "I will praise you, Lord, with all my heart; before the 'gods' I will sing your praise." },
    category: 'worship'
  },
  {
    pl: { reference: "1 J 5,11-12", text: "A świadectwo jest takie: że Bóg dał nam życie wieczne, a to życie jest w Jego Synu. Kto ma Syna, ma życie." },
    en: { reference: "1 John 5:11-12", text: "And this is the testimony: God has given us eternal life, and this life is in his Son. Whoever has the Son has life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 147,1", text: "Chwalcie Jahwe, bo dobrze jest śpiewać naszemu Bogu, bo wdzięcznie jest nucić pieśń pochwalną." },
    en: { reference: "Psalm 147:1", text: "Praise the Lord. How good it is to sing praises to our God, how pleasant and fitting to praise him!" },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 18,19", text: "Dalej, zaprawdę, powiadam wam: Jeśli dwaj z was na ziemi zgodnie o coś prosić będą, otrzymają wszystko od mojego Ojca." },
    en: { reference: "Matthew 18:19", text: "Again, truly I tell you that if two of you on earth agree about anything they ask for, it will be done for them by my Father in heaven." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 106,1", text: "Alleluja. Sławcie Jahwe, bo dobry, bo łaska Jego trwa na wieki." },
    en: { reference: "Psalm 106:1", text: "Praise the Lord. Give thanks to the Lord, for he is good; his love endures forever." },
    category: 'worship'
  },
  {
    pl: { reference: "J 6,47", text: "Zaprawdę, zaprawdę, powiadam wam: Kto wierzy, ma życie wieczne." },
    en: { reference: "John 6:47", text: "Very truly I tell you, the one who believes has eternal life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 113,1-2", text: "Alleluja. Chwalcie, słudzy Jahwe, chwalcie imię Jahwe! Niech imię Jahwe będzie błogosławione teraz i na wieki!" },
    en: { reference: "Psalm 113:1-2", text: "Praise the Lord. Praise the Lord, you his servants; praise the name of the Lord. Let the name of the Lord be praised, both now and forevermore." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 24,44", text: "Dlatego i wy bądźcie gotowi, bo w godzinie, której się nie domyślacie, Syn Człowieczy przyjdzie." },
    en: { reference: "Matthew 24:44", text: "So you also must be ready, because the Son of Man will come at an hour when you do not expect him." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 150,1", text: "Alleluja. Chwalcie Boga w Jego świątyni, chwalcie Go na nieboskłonie Jego potęgi!" },
    en: { reference: "Psalm 150:1", text: "Praise the Lord. Praise God in his sanctuary; praise him in his mighty heavens." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 6,23", text: "Albowiem zapłatą za grzech jest śmierć, a łaska przez Boga dana to życie wieczne w Chrystusie Jezusie, Jahwe naszym." },
    en: { reference: "Romans 6:23", text: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 145,3", text: "Wielki jest Jahwe i godzien wielkiej chwały, a wielkość Jego niezgłębiona." },
    en: { reference: "Psalm 145:3", text: "Great is the Lord and most worthy of praise; his greatness no one can fathom." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 25,35", text: "Bo byłem głodny, a daliście Mi jeść; byłem spragniony, a daliście Mi pić; byłem przybyszem, a przyjęliście Mnie." },
    en: { reference: "Matthew 25:35", text: "For I was hungry and you gave me something to eat, I was thirsty and you gave me something to drink, I was a stranger and you invited me in." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 103,2", text: "Błogosław, duszo moja, Jahwe i nie zapominaj o wszystkich Jego dobrodziejstwach!" },
    en: { reference: "Psalm 103:2", text: "Praise the Lord, my soul, and forget not all his benefits." },
    category: 'worship'
  },
  {
    pl: { reference: "J 5,24", text: "Zaprawdę, zaprawdę, powiadam wam: Kto słucha słowa mego i wierzy w Tego, który Mnie posłał, ma życie wieczne." },
    en: { reference: "John 5:24", text: "Very truly I tell you, whoever hears my word and believes him who sent me has eternal life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 119,164", text: "Siedmiokroć na dzień Cię wysławiam z powodu sprawiedliwych Twych wyroków." },
    en: { reference: "Psalm 119:164", text: "Seven times a day I praise you for your righteous laws." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 10,7", text: "Idźcie i głoście: Bliskie już jest królestwo niebieskie." },
    en: { reference: "Matthew 10:7", text: "As you go, proclaim this message: ‘The kingdom of heaven has come near.’" },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 146,1", text: "Alleluja. Chwal, duszo moja, Jahwe!" },
    en: { reference: "Psalm 146:1", text: "Praise the Lord. Praise the Lord, my soul." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 3,23-24", text: "Wszyscy bowiem zgrzeszyli i pozbawieni są chwały Bożej, a dostępują usprawiedliwienia darmo, z Jego łaski." },
    en: { reference: "Romans 3:23-24", text: "For all have sinned and fall short of the glory of God, and all are justified freely by his grace." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 147,12", text: "Chwal, Jerozolimo, Jahwe, wysławiaj twego Boga, Syjonie!" },
    en: { reference: "Psalm 147:12", text: "Extol the Lord, Jerusalem; praise your God, Zion." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 5,15", text: "Nie zapala się też światła i nie stawia pod korcem, ale na świeczniku, aby świeciło wszystkim, którzy są w domu." },
    en: { reference: "Matthew 5:15", text: "Neither do people light a lamp and put it under a bowl. Instead they put it on its stand, and it gives light to everyone in the house." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 100,4", text: "Wstępujcie w Jego bramy z dziękczynieniem, z hymnami w Jego dziedzińce; sławcie Go i błogosławcie Jego imię!" },
    en: { reference: "Psalm 100:4", text: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name." },
    category: 'worship'
  },
  {
    pl: { reference: "J 20,31", text: "Te zaś zapisano, abyście wierzyli, że Jezus jest Mesjaszem, Synem Bożym, i abyście wierząc mieli życie w imię Jego." },
    en: { reference: "John 20:31", text: "But these are written that you may believe that Jesus is the Messiah, the Son of God, and that by believing you may have life in his name." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 111,10", text: "Bojaźń Pańska początkiem mądrości; wspaniała zapłata dla tych, co ją zachowują. Chwała Jego trwa na wieki." },
    en: { reference: "Psalm 111:10", text: "The fear of the Lord is the beginning of wisdom; all who follow his precepts have good understanding. To him belongs eternal praise." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 13,3", text: "I mówił im wiele w przypowieściach tymi słowami: Oto siewca wyszedł siać." },
    en: { reference: "Matthew 13:3", text: "Then he told them many things in parables, saying: 'A farmer went out to sow his seed.'" },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 145,21", text: "Niech usta moje głoszą chwałę Jahwe, a wszelkie ciało niech błogosławi święte imię Jego na zawsze i na wieki." },
    en: { reference: "Psalm 145:21", text: "My mouth will speak in praise of the Lord. Let every creature praise his holy name for ever and ever." },
    category: 'worship'
  },
  {
    pl: { reference: "Iz 41,10", text: "Nie lękaj się, bo Ja jestem z tobą; nie trwóż się, bo Ja jestem twoim Bogiem. Umacniam cię, jeszcze i wspomagam." },
    en: { reference: "Isaiah 41:10", text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 34,9", text: "Skosztujcie i zobaczcie, jak dobry jest Jahwe, szczęśliwy człowiek, który się do Niego ucieka." },
    en: { reference: "Psalm 34:8", text: "Taste and see that the Lord is good; blessed is the one who takes refuge in him." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 8,31", text: "Cóż więc na to powiemy? Jeżeli Bóg z nami, któż przeciwko nam?" },
    en: { reference: "Romans 8:31", text: "What, then, shall we say in response to these things? If God is for us, who can be against us?" },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 100,5", text: "Albowiem Jahwe jest dobry, Jego łaska trwa na wieki, a Jego wierność przez wszystkie pokolenia." },
    en: { reference: "Psalm 100:5", text: "For the Lord is good and his love endures forever; his faithfulness continues through all generations." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 28,19", text: "Idźcie więc i nauczajcie wszystkie narody, udzielając im chrztu w imię Ojca i Syna, i Ducha Świętego." },
    en: { reference: "Matthew 28:19", text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 119,105", text: "Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce." },
    en: { reference: "Psalm 119:105", text: "Your word is a lamp for my feet, a light on my path." },
    category: 'worship'
  },
  {
    pl: { reference: "J 14,27", text: "Pokój zostawiam wam, pokój mój daję wam. Nie tak jak daje świat, Ja wam daję." },
    en: { reference: "John 14:27", text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 139,1-3", text: "Jahwe, przenikasz i znasz mnie, Ty wiesz, kiedy siadam i wstaję. Z daleka przenikasz moje zamysły." },
    en: { reference: "Psalm 139:1-3", text: "You have searched me, Lord, and you know me. You know when I sit and when I rise; you perceive my thoughts from afar." },
    category: 'worship'
  },
  {
    pl: { reference: "Dz 1,8", text: "Ale gdy Duch Święty zstąpi na was, otrzymacie Jego moc i będziecie moimi świadkami." },
    en: { reference: "Acts 1:8", text: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 23,4", text: "Chociażbym chodził ciemną doliną, zła się nie ulęknę, bo Ty jesteś ze mną." },
    en: { reference: "Psalm 23:4", text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me." },
    category: 'worship'
  },
  {
    pl: { reference: "1 Kor 13,13", text: "Tak więc trwają wiara, nadzieja, miłość - te trzy: z nich zaś największa jest miłość." },
    en: { reference: "1 Corinthians 13:13", text: "And now these three remain: faith, hope and love. But the greatest of these is love." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 121,1-2", text: "Wznoszę swe oczy ku górom: Skądże nadejdzie mi pomoc? Pomoc mi przyjdzie od Jahwe." },
    en: { reference: "Psalm 121:1-2", text: "I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 5,14", text: "Wy jesteście światłem świata. Nie może się ukryć miasto położone na górze." },
    en: { reference: "Matthew 5:14", text: "You are the light of the world. A town built on a hill cannot be hidden." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 46,11", text: "Zatrzymajcie się i we Mnie uznajcie Boga, wywyższonego wśród narodów, wywyższonego na ziemi!" },
    en: { reference: "Psalm 46:10", text: "He says, 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.'" },
    category: 'worship'
  },
  {
    pl: { reference: "J 1,1", text: "Na początku było Słowo, a Słowo było u Boga, i Bogiem było Słowo." },
    en: { reference: "John 1:1", text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 118,24", text: "Oto dzień, który Jahwe uczynił: radujmy się w nim i weselmy!" },
    en: { reference: "Psalm 118:24", text: "The Lord has done it this very day; let us rejoice today and be glad." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 12,21", text: "Nie daj się zwyciężyć złu, ale zło dobrem zwyciężaj!" },
    en: { reference: "Romans 12:21", text: "Do not be overcome by evil, but overcome evil with good." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 103,1", text: "Błogosław, duszo moja, Jahwe, i całe moje wnętrze - święte imię Jego!" },
    en: { reference: "Psalm 103:1", text: "Praise the Lord, my soul; all my inmost being, praise his holy name." },
    category: 'worship'
  },
  {
    pl: { reference: "Mk 16,15", text: "I rzekł do nich: Idźcie na cały świat i głoście Ewangelię wszelkiemu stworzeniu!" },
    en: { reference: "Mark 16:15", text: "He said to them, 'Go into all the world and preach the gospel to all creation.'" },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 37,5", text: "Powierz Jahwe swą drogę i zaufaj Mu: On sam będzie działał." },
    en: { reference: "Psalm 37:5", text: "Commit your way to the Lord; trust in him and he will do this." },
    category: 'worship'
  },
  {
    pl: { reference: "Ef 4,32", text: "Bądźcie dla siebie nawzajem łagodni i miłosierni! Przebaczajcie sobie, tak jak i Bóg nam przebaczył w Chrystusie." },
    en: { reference: "Ephesians 4:32", text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 95,1", text: "Przyjdźcie, radośnie śpiewajmy Jahwe, wznośmy okrzyki ku czci Skały naszego zbawienia!" },
    en: { reference: "Psalm 95:1", text: "Come, let us sing for joy to the Lord; let us shout aloud to the Rock of our salvation." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 9,37", text: "Wtedy rzekł do uczniów swoich: Żniwo wprawdzie wielkie, ale robotników mało." },
    en: { reference: "Matthew 9:37", text: "Then he said to his disciples, 'The harvest is plentiful but the workers are few.'" },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 147,3", text: "On leczy złamanych na duchu i przewiązuje ich rany." },
    en: { reference: "Psalm 147:3", text: "He heals the brokenhearted and binds up their wounds." },
    category: 'worship'
  },
  {
    pl: { reference: "1 J 4,19", text: "My miłujemy Boga, ponieważ On sam pierwszy nas umiłował." },
    en: { reference: "1 John 4:19", text: "We love because he first loved us." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 150,6", text: "Wszystko, co żyje, niech chwali Jahwe! Alleluja!" },
    en: { reference: "Psalm 150:6", text: "Let everything that has breath praise the Lord. Praise the Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Iz 6,8", text: "I usłyszałem głos Jahwe mówiącego: Kogo mam posłać? Odpowiedziałem: Oto ja, poślij mnie!" },
    en: { reference: "Isaiah 6:8", text: "Then I heard the voice of the Lord saying, 'Whom shall I send? And who will go for us?' And I said, 'Here am I. Send me!'" },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 63,4", text: "Ponieważ łaska Twoja lepsza jest od życia, moje wargi będą Cię sławić." },
    en: { reference: "Psalm 63:3", text: "Because your love is better than life, my lips will glorify you." },
    category: 'worship'
  },
  {
    pl: { reference: "J 15,12", text: "To jest moje przykazanie, abyście się wzajemnie miłowali, tak jak Ja was umiłowałem." },
    en: { reference: "John 15:12", text: "My command is this: Love each other as I have loved you." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 113,3", text: "Od wschodu słońca aż po zachód jego niech imię Jahwe będzie pochwalone!" },
    en: { reference: "Psalm 113:3", text: "From the rising of the sun to the place where it sets, the name of the Lord is to be praised." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 5,16", text: "Tak niech świeci wasze światło przed ludźmi, aby widzieli wasze dobre uczynki i chwalili Ojca waszego." },
    en: { reference: "Matthew 5:16", text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 145,18", text: "Jahwe jest blisko wszystkich, którzy Go wzywają, wszystkich wzywających Go szczerze." },
    en: { reference: "Psalm 145:18", text: "The Lord is near to all who call on him, to all who call on him in truth." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 5,8", text: "Bóg zaś okazuje nam swoją miłość właśnie przez to, że Chrystus umarł za nas, gdyśmy byli jeszcze grzesznikami." },
    en: { reference: "Romans 5:8", text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 107,1", text: "Wysławiajcie Jahwe, bo jest dobry, bo łaska Jego trwa na wieki." },
    en: { reference: "Psalm 107:1", text: "Give thanks to the Lord, for he is good; his love endures forever." },
    category: 'worship'
  },
  {
    pl: { reference: "Dz 4,12", text: "I nie ma w żadnym innym zbawienia, gdyż nie dano ludziom żadnego innego imienia." },
    en: { reference: "Acts 4:12", text: "Salvation is found in no one else, for there is no other name given to mankind." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 116,12", text: "Czym się Jahwe odpłacę za wszystko, co mi wyświadczył?" },
    en: { reference: "Psalm 116:12", text: "What shall I return to the Lord for all his goodness to me?" },
    category: 'worship'
  },
  {
    pl: { reference: "J 10,10", text: "Ja przyszedłem po to, aby owce miały życie i miały je w obfitości." },
    en: { reference: "John 10:10", text: "I have come that they may have life, and have it to the full." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 148,1", text: "Alleluja. Chwalcie Jahwe z niebios, chwalcie Go na wysokościach!" },
    en: { reference: "Psalm 148:1", text: "Praise the Lord. Praise the Lord from the heavens; praise him in the heights above." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 25,40", text: "Wszystko, co uczyniliście jednemu z tych braci moich najmniejszych, Mnieście uczynili." },
    en: { reference: "Matthew 25:40", text: "Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 138,1", text: "Będę Cię sławił z całego serca, będę Ci śpiewał wobec aniołów." },
    en: { reference: "Psalm 138:1", text: "I will praise you, Lord, with all my heart; before the 'gods' I will sing your praise." },
    category: 'worship'
  },
  {
    pl: { reference: "1 J 4,10", text: "W tym przejawia się miłość, że nie my umiłowaliśmy Boga, ale że On sam nas umiłowali." },
    en: { reference: "1 John 4:10", text: "This is love: not that we loved God, but that he loved us." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 111,1", text: "Alleluja. Z całego serca chcę chwalić Jahwe w radzie sprawiedliwych i w zgromadzeniu." },
    en: { reference: "Psalm 111:1", text: "Praise the Lord. I will extol the Lord with all my heart in the council of the upright and in the assembly." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 10,15", text: "Jakże mogliby głosić, jeśliby nie zostali posłani? Jak napisano: Jak piękne są stopy tych, którzy zwiastują dobrą nowinę!" },
    en: { reference: "Romans 10:15", text: "And how can anyone preach unless they are sent? As it is written: 'How beautiful are the feet of those who bring good news!'" },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 149,1", text: "Alleluja. Śpiewajcie Jahwe pieśń nową, chwała Jego niech brzmi w zgromadzeniu świętych." },
    en: { reference: "Psalm 149:1", text: "Praise the Lord. Sing to the Lord a new song, his praise in the assembly of his faithful people." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 1,16", text: "Bo ja nie wstydzę się Ewangelii, jest ona bowiem mocą Bożą ku zbawieniu dla każdego wierzącego." },
    en: { reference: "Romans 1:16", text: "For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 146,1-2", text: "Chwal, duszo moja, Jahwe! Chcę chwalić Jahwe, jak długo żyć będę; chcę śpiewać Bogu mojemu, póki istnieję." },
    en: { reference: "Psalm 146:1-2", text: "Praise the Lord. Praise the Lord, my soul. I will praise the Lord all my life; I will sing praise to my God as long as I live." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 24,14", text: "A ta Ewangelia o królestwie będzie głoszona po całej ziemi, na świadectwo wszystkim narodom." },
    en: { reference: "Matthew 24:14", text: "And this gospel of the kingdom will be preached in the whole world as a testimony to all nations." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 117,1-2", text: "Chwalcie Jahwe, wszystkie narody, wysławiajcie Go, wszystkie ludy! Bo Jego łaskawość nad nami potężna." },
    en: { reference: "Psalm 117:1-2", text: "Praise the Lord, all you nations; extol him, all you peoples. For great is his love toward us." },
    category: 'worship'
  },
  {
    pl: { reference: "J 3,17", text: "Bo nie posłał Bóg Syna na świat, aby świat potępił, ale po to, by świat został przez Niego zbawiony." },
    en: { reference: "John 3:17", text: "For God did not send his Son into the world to condemn the world, but to save the world through him." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 135,1", text: "Alleluja. Chwalcie imię Jahwe, chwalcie, słudzy Jahwe!" },
    en: { reference: "Psalm 135:1", text: "Praise the Lord. Praise the name of the Lord; praise him, you servants of the Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Dz 13,47", text: "Ustanowiłem cię światłością dla pogan, abyś był zbawieniem aż po krańce ziemi." },
    en: { reference: "Acts 13:47", text: "I have made you a light for the Gentiles, that you may bring salvation to the ends of the earth." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 105,1", text: "Sławcie Jahwe, wzywajcie Jego imienia, głoście dzieła Jego wśród narodów!" },
    en: { reference: "Psalm 105:1", text: "Give praise to the Lord, proclaim his name; make known among the nations what he has done." },
    category: 'worship'
  },
  {
    pl: { reference: "Rz 6,23", text: "Albowiem zapłatą za grzech jest śmierć, a łaska przez Boga dana to życie wieczne w Chrystusie Jezusie." },
    en: { reference: "Romans 6:23", text: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 106,1", text: "Alleluja. Chwalcie Jahwe, bo dobry, bo łaska Jego trwa na wieki." },
    en: { reference: "Psalm 106:1", text: "Praise the Lord. Give thanks to the Lord, for he is good; his love endures forever." },
    category: 'worship'
  },
  {
    pl: { reference: "Mt 28,20", text: "A oto Ja jestem z wami przez wszystkie dni, aż do skończenia świata." },
    en: { reference: "Matthew 28:20", text: "And surely I am with you always, to the very end of the age." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 115,1", text: "Nie nam, Jahwe, nie nam, lecz Twemu imieniu daj chwałę za Twoją łaskę i wierność!" },
    en: { reference: "Psalm 115:1", text: "Not to us, Lord, not to us but to your name be the glory, because of your love and faithfulness." },
    category: 'worship'
  },
  {
    pl: { reference: "Ef 2,8", text: "Łaską bowiem jesteście zbawieni przez wiarę. A to pochodzi nie od was, lecz jest darem Boga." },
    en: { reference: "Ephesians 2:8", text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 134,1", text: "Oto błogosławcie Jahwe, wszyscy słudzy Jahwe, którzy trwacie nocami w domu Jahwe!" },
    en: { reference: "Psalm 134:1", text: "Praise the Lord, all you servants of the Lord who minister by night in the house of the Lord." },
    category: 'worship'
  },
  {
    pl: { reference: "Kol 4,5", text: "Wobec tych, którzy są z zewnątrz, postępujcie mądrze, wyzyskując każdą chwilę." },
    en: { reference: "Colossians 4:5", text: "Be wise in the way you act toward outsiders; make the most of every opportunity." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 144,1", text: "Błogosławiony Jahwe - Opoka moja, On zaprawia moje ręce do walki, moje palce do bitwy." },
    en: { reference: "Psalm 144:1", text: "Praise be to the Lord my Rock, who trains my hands for war, my feet for battle." },
    category: 'worship'
  },
  {
    pl: { reference: "1 J 1,9", text: "Jeżeli wyznajemy nasze grzechy, Bóg jako wierny i sprawiedliwy odpuści je nam i oczyści nas z wszelkiej nieprawości." },
    en: { reference: "1 John 1:9", text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 145,1", text: "Chcę Cię wywyższać, Boże mój, Królu, i błogosławić imię Twe na zawsze i na wieki." },
    en: { reference: "Psalm 145:1", text: "I will exalt you, my God the King; I will praise your name for ever and ever." },
    category: 'worship'
  },
  {
    pl: { reference: "1 P 3,15", text: "Jahwe zaś Chrystusa miejcie w sercach za Świętego i bądźcie zawsze gotowi do obrony wobec każdego, kto domaga się od was uzasadnienia tej nadziei." },
    en: { reference: "1 Peter 3:15", text: "But in your hearts revere Christ as Lord. Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 147,1", text: "Alleluja. Dobrze jest śpiewać Bogu naszemu, wdzięcznie jest nucić pieśń pochwalną." },
    en: { reference: "Psalm 147:1", text: "Praise the Lord. How good it is to sing praises to our God, how pleasant and fitting to praise him!" },
    category: 'worship'
  },
  {
    pl: { reference: "J 8,12", text: "Ja jestem światłością świata. Kto idzie za Mną, nie będzie chodził w ciemności, lecz będzie miał światło życia." },
    en: { reference: "John 8:12", text: "I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life." },
    category: 'evangelistic'
  },
  {
    pl: { reference: "Ps 148,13", text: "Niech imię Jahwe sławią, bo tylko Jego imię jest wzniosłe; majestat Jego ponad ziemią i niebem." },
    en: { reference: "Psalm 148:13", text: "Let them praise the name of the Lord, for his name alone is exalted; his splendor is above the earth and the heavens." },
    category: 'worship'
  },
  {
    pl: { reference: "2 Kor 5,20", text: "Tak więc w imieniu Chrystusa spełniamy posłannictwo jakby Boga samego, który przez nas udziela upomnień." },
    en: { reference: "2 Corinthians 5:20", text: "We are therefore Christ’s ambassadors, as though God were making his appeal through us." },
    category: 'missionary'
  },
  {
    pl: { reference: "Ps 150,1", text: "Alleluja. Chwalcie Boga w Jego świątyni, chwalcie Go na nieboskłonie Jego potęgi!" },
    en: { reference: "Psalm 150:1", text: "Praise the Lord. Praise God in his sanctuary; praise him in his mighty heavens." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 37,3", text: "Miej ufność w Jahwe i czyń to, co dobre, mieszkaj w kraju i zachowaj wierność." },
    en: { reference: "Psalm 37:3", text: "Trust in the Lord and do good; dwell in the land and enjoy safe pasture." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 37,4", text: "Raduj się w Jahwe, a On spełni pragnienia twego serca." },
    en: { reference: "Psalm 37:4", text: "Take delight in the Lord, and he will give you the desires of your heart." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 37,5", text: "Powierz Jahwe swą drogę i zaufaj Mu: On sam będzie działał." },
    en: { reference: "Psalm 37:5", text: "Commit your way to the Lord; trust in him and he will do this." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 37,7", text: "Upadnij przed Jahwe i miej w Nim nadzieję!" },
    en: { reference: "Psalm 37:7", text: "Be still before the Lord and wait patiently for him." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 37,23", text: "Jahwe umacnia kroki człowieka i w jego drodze ma upodobanie." },
    en: { reference: "Psalm 37:23", text: "The Lord makes firm the steps of the one who delights in him." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 37,24", text: "Choćby upadł, nie będzie leżał, bo Jahwe podtrzymuje go za rękę." },
    en: { reference: "Psalm 37:24", text: "Though he may stumble, he will not fall, for the Lord upholds him with his hand." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 37,39", text: "Zbawienie sprawiedliwych pochodzi od Jahwe; On ich twierdzą w czasie utrapienia." },
    en: { reference: "Psalm 37:39", text: "The salvation of the righteous comes from the Lord; he is their stronghold in time of trouble." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 40,2", text: "Z nadzieją czekałem na Jahwe, a On pochylił się nade mną i wysłuchał mego wołania." },
    en: { reference: "Psalm 40:1", text: "I waited patiently for the Lord; he turned to me and heard my cry." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 40,3", text: "Wydobył mnie z dołu zagłady, z błotnistego trzęsawiska; postawił moje stopy na skale i umocnił moje kroki." },
    en: { reference: "Psalm 40:2", text: "He lifted me out of the slimy pit, out of the mud and mire; he set my feet on a rock and gave me a firm place to stand." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 40,4", text: "Włożył w moje usta pieśń nową, hymn dla naszego Boga." },
    en: { reference: "Psalm 40:3", text: "He put a new song in my mouth, a hymn of praise to our God." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 40,6", text: "Wiele uczyniłeś cudów, Jahwe, Boże mój, a w Twoich zamiarach względem nas nikt Ci nie dorówna." },
    en: { reference: "Psalm 40:5", text: "Many, Lord my God, are the wonders you have done, the things you planned for us. None can compare with you." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 40,9", text: "Czynić Twoją wolę, Boże mój, jest moim pragnieniem, a Twoje Prawo mieszka w moim wnętrzu." },
    en: { reference: "Psalm 40:8", text: "I desire to do your will, my God; your law is within my heart." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 42,2", text: "Jak łania pragnie wody ze strumieni, tak dusza moja pragnie Ciebie, Boże!" },
    en: { reference: "Psalm 42:1", text: "As the deer pants for streams of water, so my soul pants for you, my God." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 42,3", text: "Dusza moja pragnie Boga, Boga żywego: kiedyż przyjdę i ujrzę oblicze Boże?" },
    en: { reference: "Psalm 42:2", text: "My soul thirsts for God, for the living God. When can I go and meet with God?" },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 42,6", text: "Czemu jesteś zgnębiona, moja duszo, i czemu burzysz się we mnie? Ufaj Bogu, bo jeszcze będę Go wysławiać: On zbawieniem mego oblicza i moim Bogiem." },
    en: { reference: "Psalm 42:5", text: "Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 46,2", text: "Bóg jest dla nas ucieczką i mocą: najpewniejszą pomocą w trudnościach." },
    en: { reference: "Psalm 46:1", text: "God is our refuge and strength, an ever-present help in trouble." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 46,11", text: "Zatrzymajcie się i uznajcie, że Ja jestem Bogiem, wywyższonym wśród narodów, wywyższonym na ziemi!" },
    en: { reference: "Psalm 46:10", text: "He says, 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.'" },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 47,2", text: "Wszystkie narody, klaskajcie w dłonie, radosnym głosem wykrzykujcie Bogu!" },
    en: { reference: "Psalm 47:1", text: "Clap your hands, all you nations; shout to God with cries of joy." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 47,7", text: "Śpiewajcie psalm Bogu, śpiewajcie; śpiewajcie Królowi naszemu, śpiewajcie!" },
    en: { reference: "Psalm 47:6", text: "Sing praises to God, sing praises; sing praises to our King, sing praises." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 48,2", text: "Wielki jest Jahwe i godzien wielkiej chwały w mieście Boga naszego, na Jego świętej górze." },
    en: { reference: "Psalm 48:1", text: "Great is the Lord, and most worthy of praise, in the city of our God, his holy mountain." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 51,3", text: "Zmiłuj się nade mną, Boże, w łaskawości Twojej: w ogromie Twej litości zgładź moją nieprawość!" },
    en: { reference: "Psalm 51:1", text: "Have mercy on me, O God, according to your unfailing love; according to your great compassion blot out my transgressions." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 51,12", text: "Stwórz, o Boże, we mnie serce czyste i odnów w mojej piersi ducha niezwyciężonego!" },
    en: { reference: "Psalm 51:10", text: "Create in me a pure heart, O God, and renew a steadfast spirit within me." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 51,13", text: "Nie odrzucaj mnie od swego oblicza i nie odbieraj mi świętego ducha swego!" },
    en: { reference: "Psalm 51:11", text: "Do not cast me from your presence or take your Holy Spirit from me." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 51,14", text: "Przywróć mi radość z Twojego zbawienia i wzmocnij mnie duchem ochoczym!" },
    en: { reference: "Psalm 51:12", text: "Restore to me the joy of your salvation and grant me a willing spirit, to sustain me." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 51,17", text: "Jahwe, otwórz wargi moje, a usta moje będą głosić Twoją chwałę." },
    en: { reference: "Psalm 51:15", text: "Open my lips, Lord, and my mouth will declare your praise." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 51,19", text: "Ofiarą dla Boga jest duch skruszony: sercem pokornym i skruszonym Ty, Boże, nie gardzisz." },
    en: { reference: "Psalm 51:17", text: "My sacrifice, O God, is a broken spirit; a broken and contrite heart you, God, will not despise." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 55,23", text: "Zrzuć swą troskę na Jahwe, a On cię podtrzyma; nie dopuści nigdy, by zachwiał się sprawiedliwy." },
    en: { reference: "Psalm 55:22", text: "Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 56,4", text: "Kiedy mnie strach ogarnia, ja w Tobie pokładam nadzieję." },
    en: { reference: "Psalm 56:3", text: "When I am afraid, I put my trust in you." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 56,11", text: "W Bogu uwielbiam Jego słowo, w Jahwe uwielbiam Jego słowo." },
    en: { reference: "Psalm 56:10", text: "In God, whose word I praise, in the Lord, whose word I praise." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 57,8", text: "Serce moje jest mocne, Boże, serce moje jest mocne; będę śpiewał i grał psalmy." },
    en: { reference: "Psalm 57:7", text: "My heart, O God, is steadfast, my heart is steadfast; I will sing and make music." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 57,10", text: "Będę Cię sławił wśród ludów, o Jahwe; będę Ci śpiewał psalmy wśród narodów." },
    en: { reference: "Psalm 57:9", text: "I will praise you, Lord, among the nations; I will sing of you among the peoples." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 57,11", text: "Bo Twoja łaskawość sięga aż do niebios, a Twoja wierność aż do chmur." },
    en: { reference: "Psalm 57:10", text: "For great is your love, reaching to the heavens; your faithfulness reaches to the skies." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 57,12", text: "Wznieś się, o Boże, ponad niebiosa; nad całą ziemią niech będzie Twoja chwała!" },
    en: { reference: "Psalm 57:11", text: "Be exalted, O God, above the heavens; let your glory be over all the earth." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 59,17", text: "Ja zaś będę śpiewał o Twojej potędze i rano będę się radował Twoją łaską, bo stałeś się dla mnie twierdzą i ucieczką w dniu mego ucisku." },
    en: { reference: "Psalm 59:16", text: "But I will sing of your strength, in the morning I will sing of your love; for you are my fortress, my refuge in times of trouble." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 61,3", text: "Z krańców ziemi wołam do Ciebie, gdy słabnie moje serce: wprowadź mnie na skałę, która jest dla mnie za wysoka." },
    en: { reference: "Psalm 61:2", text: "From the ends of the earth I call to you, I call as my heart grows faint; lead me to the rock that is higher than I." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 62,2", text: "Jedynie w Bogu spokój znajduje moja dusza, od Niego pochodzi moje zbawienie." },
    en: { reference: "Psalm 62:1", text: "Truly my soul finds rest in God; my salvation comes from him." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 62,6", text: "Jedynie w Bogu szukaj spokoju, moja duszo, bo w Nim moja nadzieja." },
    en: { reference: "Psalm 62:5", text: "Yes, my soul, find rest in God; my hope comes from him." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 62,7", text: "On tylko jest moją opoką i moim zbawieniem, On moją twierdzą: nie zachwieję się." },
    en: { reference: "Psalm 62:6", text: "Truly he is my rock and my salvation; he is my fortress, I will not be shaken." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 62,8", text: "W Bogu moje zbawienie i moja chwała, skała mojej mocy; moja ucieczka jest w Bogu." },
    en: { reference: "Psalm 62:7", text: "My salvation and my honor depend on God; he is my mighty rock, my refuge." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 62,9", text: "Ufajcie Mu w każdym czasie, o ludzie! Wylewajcie przed Nim wasze serca: Bóg jest dla nas ucieczką!" },
    en: { reference: "Psalm 62:8", text: "Trust in him at all times, you people; pour out your hearts to him, for God is our refuge." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 63,2", text: "Boże, Tyś Bogiem moim, Ciebie szukam; Ciebie pragnie moja dusza, za Tobą tęskni moje ciało, jak ziemia zeschła, spragniona, bez wody." },
    en: { reference: "Psalm 63:1", text: "You, God, are my God, earnestly I seek you; my soul thirsts for you, my whole body longs for you, in a dry and parched land where there is no water." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 63,4", text: "Bo Twoja łaska jest lepsza od życia, moje wargi będą Cię sławić." },
    en: { reference: "Psalm 63:3", text: "Because your love is better than life, my lips will glorify you." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 63,5", text: "Tak będę Cię błogosławił w moim życiu, w imię Twoje będę wznosił moje ręce." },
    en: { reference: "Psalm 63:4", text: "I will praise you as long as I live, and in your name I will lift up my hands." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 63,8", text: "Bo stałeś się dla mnie pomocą i w cieniu Twych skrzydeł wołam radośnie." },
    en: { reference: "Psalm 63:7", text: "Because you are my help, I sing in the shadow of your wings." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 63,9", text: "Dusza moja lgnie do Ciebie, Twoja prawica mnie podtrzymuje." },
    en: { reference: "Psalm 63:8", text: "I cling to you; your right hand upholds me." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 66,1", text: "Z radością wykrzykuj Bogu, cała ziemio!" },
    en: { reference: "Psalm 66:1", text: "Shout for joy to God, all the earth!" },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 66,2", text: "Śpiewajcie pieśń chwały Jego imieniu, oddajcie Mu wspaniałą cześć!" },
    en: { reference: "Psalm 66:2", text: "Sing the glory of his name; make his praise glorious." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 66,4", text: "Niech cała ziemia Ci się kłania i śpiewa Tobie, niech śpiewa Twojemu imieniu!" },
    en: { reference: "Psalm 66:4", text: "All the earth bows down to you; they sing praise to you, they sing the praises of your name." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 66,16", text: "Przyjdźcie i słuchajcie, wszyscy, którzy boicie się Boga, a opowiem, co uczynił On mojej duszy." },
    en: { reference: "Psalm 66:16", text: "Come and hear, all you who fear God; let me tell you what he has done for me." },
    category: 'worship'
  },
  {
    pl: { reference: "Ps 66,20", text: "Błogosławiony niech będzie Bóg, który nie odrzucił mej modlitwy i nie odjął mi swej łaski." },
    en: { reference: "Psalm 66:20", text: "Praise be to God, who has not rejected my prayer or withheld his love from me!" },
    category: 'worship'
  }
];

export function getVerseForDate(date: Date): DualBibleVerse {
  // Use day of year and 15 minute segment to select a verse
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const hour = date.getHours();
  const segment15 = Math.floor(date.getMinutes() / 15);
  const segmentOfDay = hour * 4 + segment15;
  
  // Deterministic selection based on day of year and segment
  const index = (dayOfYear * 96 + segmentOfDay) % DAILY_VERSES.length;
  const selected = DAILY_VERSES[index];
  
  return {
    pl: selected.pl,
    en: selected.en,
    // Add other languages as needed, or fallback to English
    de: selected.en,
    es: selected.en,
    fr: selected.en,
    it: selected.en,
    pt: selected.en,
    uk: selected.en
  };
}
