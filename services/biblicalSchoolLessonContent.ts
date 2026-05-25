export const getStaticLessonContent = (topicId: string, lang: 'pl' | 'en'): string | null => {
  const lessons: Record<string, { pl: string; en: string }> = {

    'Pismo Święte': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Pismo Święte**.

### Lekcja: Pismo Święte
Pismo Święte, Stary i Nowy Testament, jest Słowem Bożym przekazanym przez Boskie natchnienie za pośrednictwem świętych ludzi Bożych, którzy mówili i pisali pod wpływem Ducha Świętego. W tym Słowie Bóg przekazał ludzkości wiedzę niezbędną do zbawienia.

Pismo Święte jest nieomylnym objawieniem Jego woli. Jest ono wzorcem charakteru, sprawdzianem doświadczenia, autorytatywnym wykładowcą doktryn oraz wiarygodnym zapisem Bożych działań w historii.

**Podstawa Biblijna:**
* "Całe Pismo przez Boga jest natchnione i pożyteczne do nauki, do wykrywania błędów, do poprawy, do wychowywania w sprawiedliwości" (2 Tm 3:16).
* "Albowiem proroctwo nie przyszło nigdy z woli ludzkiej, lecz wypowiadali je ludzie Boży, natchnieni Duchem Świętym" (2 P 1:21).
* J 17:17; Ps 119:105; Prz 30:5.6; Iz 8:20.

### Zastosowanie
Czy Pismo Święte jest dla Ciebie codziennym pokarmem? Bóg mówi do Ciebie bezpośrednio przez Swoje Słowo. Gdy stajesz wobec trudnych decyzji, pytaj najpierw: "Co mówi Pan?".

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Holy Scriptures**.

### Lesson: The Holy Scriptures
The Holy Scriptures, Old and New Testaments, are the written Word of God, given by divine inspiration through holy men of God who spoke and wrote as they were moved by the Holy Spirit. In this Word, God has committed to humanity the knowledge necessary for salvation.

The Holy Scriptures are the infallible revelation of His will. They are the standard of character, the test of experience, the authoritative revealer of doctrines, and the trustworthy record of God’s acts in history.

**Biblical Foundation:**
* "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness" (2 Tim 3:16).
* "For no prophecy was ever produced by the will of man, but men spoke from God as they were carried along by the Holy Spirit" (2 Pet 1:21).
* John 17:17; Ps 119:105; Prov 30:5, 6; Isa 8:20.

### Application
Is the Holy Scripture your daily bread? God speaks to you directly through His Word. When facing hard decisions, ask first: "What does the Lord say?".

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Trójca': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Trójca**.

### Lekcja: Trójca
Jeden jest Bóg: Ojciec, Syn i Duch Święty — jedność trzech współwiecznych Osób. Bóg jest nieśmiertelny, wszechmocny, wszechwiedzący, ponad wszystkim i wszędzie obecny. Jest nieskończony i przekraczający ludzkie pojmowanie, a jednak znany dzięki temu, że sam się objawił.

Jest On wiecznie godzien czci, uwielbienia i służby całego stworzenia. Choć natura Trójcy pozostaje tajemnicą, Pismo Święte wyraźnie ukazuje współdziałanie trzech Osób w dziele stworzenia i odkupienia człowieka.

**Podstawa Biblijna:**
* "Idźcie więc i nauczajcie wszystkie narody, udzielając im chrztu w imię Ojca i Syna, i Ducha Świętego" (Mt 28:19).
* "Łaska Pana Jezusa Chrystusa i miłość Boga, i społeczność Ducha Świętego niech będzie z wami wszystkimi" (2 Kor 13:13).
* Pwt 6:4; Ef 4:4-6; 1 P 1:2.

### Zastosowanie
Bóg nie jest samotną istotą, lecz wspólnotą miłości. Zostałeś stworzony na Jego obraz, aby żyć w relacji z Nim i z innymi ludźmi. Dzisiaj podziękuj Bogu za Jego potęgę i bliskość.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Trinity**.

### Lesson: The Trinity
There is one God: Father, Son, and Holy Spirit, a unity of three coeternal Persons. God is immortal, all-powerful, all-knowing, above all, and ever present. He is infinite and beyond human comprehension, yet known through His self-revelation.

He is forever worthy of worship, adoration, and service by the whole creation. While the nature of the Trinity remains a mystery, the Scriptures clearly show the cooperation of the three Persons in the work of creation and redemption.

**Biblical Foundation:**
* "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit" (Matt 28:19).
* "The grace of the Lord Jesus Christ and the love of God and the fellowship of the Holy Spirit be with you all" (2 Cor 13:14).
* Deut 6:4; Eph 4:4-6; 1 Pet 1:2.

### Application
God is not a solitary being, but a community of love. You were created in His image to live in relationship with Him and others. Today, thank God for His power and His presence.

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Bóg Ojciec': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Bóg Ojciec**.

### Lekcja: Bóg Ojciec
Bóg przedwieczny Ojciec jest Stwórcą, Źródłem, Sprawcą i Suwerenem całego stworzenia. Jest sprawiedliwy i święty, miłosierny i łaskawy, nieskory do gniewu oraz pełen niezmiennej miłości i wierności. Przymioty i potęga przejawiające się w Synu i Duchu Świętym są także objawieniem Ojca.

**Podstawa Biblijna:**
* "Łaska wam i pokój od Boga, Ojca naszego, i od Pana Jezusa Chrystusa" (1 Kor 1:3).
* "Bóg jest miłością" (1 J 4:8).
* "Gdyż tak Bóg umiłował świat, że Syna swego jednorodzonego dał..." (J 3:16).
* Rdz 1:1; Obj 4:11; 1 Kor 15:28; J 3:16.

### Zastosowanie
Bóg nie jest tylko dalekim Absolutem, ale kochającym Ojcem, który troszczy się o każde Swoje dziecko. Nie musisz już być sierotą w tym świecie. Możesz wołać "Abba, Ojcze!" z pełnym przekonaniem, że On Cię słyszy i kocha.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **God the Father**.

### Lesson: God the Father
God the eternal Father is the Creator, Source, Sustainer, and Sovereign of all creation. He is just and holy, merciful and gracious, slow to anger, and abounding in steadfast love and faithfulness. The qualities and powers exhibited in the Son and the Holy Spirit are also revelations of the Father.

**Biblical Foundation:**
* "Grace to you and peace from God our Father and the Lord Jesus Christ" (1 Cor 1:3).
* "God is love" (1 John 4:8).
* "For God so loved the world that He gave His only begotten Son..." (John 3:16).
* Gen 1:1; Rev 4:11; 1 Cor 15:28; John 3:16.

### Application
God is not just a distant Absolute, but a loving Father who cares for each of His children. You no longer have to be an orphan in this world. You can cry "Abba, Father!" with full confidence that He hears and loves you.

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Bóg Syn': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Bóg Syn**.

### Lekcja: Bóg Syn
Bóg przedwieczny Syn stał się człowiekiem w Jezusie Chrystusie. Przez Niego wszystko zostało stworzone, przez Niego objawiony został charakter Boga, dokonane zostało zbawienie ludzkości i przez Niego świat jest sądzony. Jezus Chrystus, będąc prawdziwym Bogiem, stał się także prawdziwym człowiekiem. Został poczęty z Ducha Świętego i narodzony z dziewicy Marii.

**Podstawa Biblijna:**
* "Na początku było Słowo, a Słowo było u Boga, i Bogiem było Słowo" (J 1:1).
* "On jest obrazem Boga niewidzialnego, pierworodnym wszelkiego stworzenia" (Kol 1:15).
* J 1:1-3.14; Kol 1:15-19; J 10:30; 14:9; Rz 6:23; 2 Kor 5:17-19.

### Zastosowanie
Jezus nie jest tylko postacią historyczną. On jest Twoim Zbawicielem, Przyjacielem i Panem. Jego zwycięstwo na krzyżu jest Twoim zwycięstwem nad lękiem, grzechem i potępieniem. Dzisiaj wybierz posłuszeństwo Jemu.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **God the Son**.

### Lesson: God the Son
God the eternal Son became incarnate in Jesus Christ. Through Him all things were created, the character of God is revealed, the salvation of humanity is accomplished, and the world is judged. Jesus Christ, being truly God, became also truly man. He was conceived of the Holy Spirit and born of the virgin Mary.

**Biblical Foundation:**
* "In the beginning was the Word, and the Word was with God, and the Word was God" (John 1:1).
* "He is the image of the invisible God, the firstborn over all creation" (Col 1:15).
* John 1:1-3, 14; Col 1:15-19; John 10:30; 14:9; Rom 6:23; 2 Cor 5:17-19.

### Application
Jesus is not just a historical figure. He is your Savior, Friend, and Lord. His victory on the cross is your victory over fear, sin, and condemnation. Today, choose to follow Him.

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Bóg Duch Święty': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Bóg Duch Święty**.

### Lekcja: Bóg Duch Święty
Bóg przedwieczny Duch Święty brał czynny udział wraz z Ojcem i Synem w dziele stworzenia, wcielenia i odkupienia. Inspirował pisarzy Pisma Świętego. Napełniał mocą życie Chrystusa. Przekonuje ludzi o grzechu, a tych, którzy odpowiadają na Jego wezwanie, odradza i przemienia na obraz Boży. Posłany przez Ojca i Syna, aby zawsze być z Jego dziećmi.

**Podstawa Biblijna:**
* "A ziemia była pustkowiem i chaosem... a Duch Boży unosił się nad powierzchnią wód" (Rdz 1:2).
* "Ale weźmiecie moc Ducha Świętego, kiedy zstąpi na was..." (Dz 1:8).
* Rdz 1:1.2; Łk 1:35; 2 P 1:21; Dz 1:8; 10:38; J 14:16-18.26; 16:7-13.

### Zastosowanie
Duch Święty jest Bogiem mieszkającym w Tobie dzisiaj. On daje Ci moc do pokonywania słabości i bycia świadkiem Jezusa. Nie musisz walczyć o świętość własnymi siłami – poddaj się prowadzeniu Ducha, a On dokona w Tobie przemiany.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **God the Holy Spirit**.

### Lesson: God the Holy Spirit
God the eternal Holy Spirit was active with the Father and the Son in Creation, Incarnation, and Redemption. He inspired the writers of Scripture. He filled Christ’s life with power. He draws and convicts human beings; and those who respond He renews and transforms into the image of God. Sent by the Father and the Son to be always with His children.

**Biblical Foundation:**
* "The earth was without form, and void... and the Spirit of God was hovering over the face of the waters" (Gen 1:2).
* "But you shall receive power when the Holy Spirit has come upon you..." (Acts 1:8).
* Gen 1:1, 2; Luke 1:35; 2 Pet 1:21; Acts 1:8, 10:38; John 14:16-18, 26; 16:7-13.

### Application
The Holy Spirit is God living in you today. He gives you power to overcome weaknesses and be a witness for Jesus. You don't have to fight for holiness with your own strength – submit to the Spirit's guidance, and He will transform you.

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Stworzenie': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Stworzenie**.

### Lekcja: Stworzenie
Bóg jest Stwórcą wszystkiego. Przekazał On nam w Piśmie Świętym wiarygodne sprawozdanie o swej stwórczej działalności. W ciągu sześciu dni Pan uczynił „niebo i ziemię” oraz wszystkie żywe istoty na ziemi, a siódmego dnia tego pierwszego tygodnia odpoczął. W ten sposób ustanowił On sabat jako wieczny pamiątkę swego dokonanego dzieła stworzenia.

**Podstawa Biblijna:**
* "Na początku stworzył Bóg niebo i ziemię" (Rdz 1:1).
* "Bo w sześciu dniach uczynił Pan niebo i ziemię, morze i wszystko, co w nich jest, a siódmego dnia odpoczął" (Wj 20:11).
* Rdz 1; 2; Wj 20:8-11; Ps 19:2-7; 33:6.9; 104; Hbr 11:3.

### Zastosowanie
Świat nie jest dziełem przypadku, ale wyrazem Bożej miłości i porządku. Ty również nie jesteś przypadkiem – zostałeś zaplanowany przez Stwórcę. Podziwiaj piękno natury i dziękuj Bogu za dar życia.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Creation**.

### Lesson: Creation
God is Creator of all things, and has revealed in Scripture the authentic account of His creative activity. In six days the Lord made “the heaven and the earth” and all living things upon the earth, and rested on the seventh day of that first week. Thus He established the Sabbath as a perpetual memorial of His completed creative work.

**Biblical Foundation:**
* "In the beginning God created the heavens and the earth" (Gen 1:1).
* "For in six days the Lord made the heavens and the earth, the sea, and all that is in them, and rested the seventh day" (Exod 20:11).
* Gen 1; 2; Exod 20:8-11; Ps 19:1–6; 33:6, 9; 104; Heb 11:3.

### Application
The world is not a product of chance, but an expression of God's love and order. You are not an accident either – you were planned by the Creator. Admire the beauty of nature and thank God for the gift of life.

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Natura ludzka': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Natura ludzka**.

### Lekcja: Natura ludzka
Mężczyzna i kobieta zostali stworzeni na obraz Boży, z indywidualnością oraz mocą i wolnością myślenia i działania. Choć stworzeni jako istoty wolne, są oni całością złożoną z ciała, duszy i ducha, zależną od Boga w kwestii życia, tchu i wszystkiego innego. Kiedy nasi pierwsi rodzice zgrzeszyli, natura ludzka uległa skażeniu, a śmierć stała się udziałem wszystkich.

**Podstawa Biblijna:**
* "I stworzył Bóg człowieka na obraz swój..." (Rdz 1:27).
* "Ukształtował Pan Bóg człowieka z prochu ziemi i tchnął w nozdrza jego dech życia. Wtedy stał się człowiek istotą żywą" (Rdz 2:7).
* Rdz 1:26-28; 2:7; 3; Ps 8:5-9; Dz 17:24-28; Rz 5:12-17; 2 Kor 5:19.20.

### Zastosowanie
Twoja wartość nie wynika z tego, co posiadasz, ale z faktu, że jesteś stworzony na obraz Boży. Choć jesteśmy upadli, Bóg widzi w Tobie potencjał do odnowienia Jego obrazu przez łaskę Chrystusa.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Nature of Humanity**.

### Lesson: The Nature of Humanity
Man and woman were made in the image of God with individuality, the power and freedom to think and to do. Though created free beings, each is an indivisible unity of body, mind, and spirit, dependent upon God for life and breath and all else. When our first parents disobeyed God, they denied their dependence upon Him and fell from their high position under God. Their descendants share this fallen nature and its consequences.

**Biblical Foundation:**
* "So God created man in His own image..." (Gen 1:27).
* "And the Lord God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living being" (Gen 2:7).
* Gen 1:26-28; 2:7; 3; Ps 8:4-8; Acts 17:24-28; Rom 5:12-17; 2 Cor 5:19, 20.

### Application
Your value does not come from what you possess, but from the fact that you are created in the image of God. Although we are fallen, God sees in you the potential to restore His image through the grace of Christ.

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Wielki Bój': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Wielki Bój**.

### Lekcja: Wielki Bój
Cała ludzkość bierze obecnie udział w wielkim konflikcie między Chrystusem a szatanem, dotyczącym charakteru Boga, Jego prawa i Jego zwierzchnictwa nad wszechświatem. Konflikt ten rozpoczął się w niebie, kiedy jedno ze stworzeń, obdarzone wolnością wyboru, przez wywyższenie samego siebie stało się szatanem, przeciwnikiem Boga. Rozszerzył on ducha buntu na naszą ziemię, gdy zwiódł Adama i Ewę do grzechu.

**Podstawa Biblijna:**
* "I wybuchła walka w niebie: Michał i aniołowie jego walczyli ze smokiem..." (Obj 12:7).
* "Bądźcie trzeźwi, czuwajcie! Przeciwnik wasz, diabeł, krąży jak lew ryczący..." (1 P 5:8).
* Obj 12:4-9; Iz 14:12-14; Ez 28:12-18; Rdz 3; Rz 1:19-32; 5:12-21; 1 Kor 4:9; Hbr 1:14.

### Zastosowanie
Jesteśmy częścią kosmicznego dramatu. Twoje codzienne wybory mają znaczenie w tym konflikcie. Wybieraj stronę Zwycięzcy – Jezusa Chrystusa, który już pokonał wroga na krzyżu.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Great Controversy**.

### Lesson: The Great Controversy
All humanity is now involved in a great controversy between Christ and Satan regarding the character of God, His law, and His sovereignty over the universe. This conflict originated in heaven when a created being, endowed with freedom of choice, in self-exaltation became Satan, God’s adversary. He led Adam and Eve into sin and brought the spirit of rebellion to this earth.

**Biblical Foundation:**
* "And war broke out in heaven: Michael and his angels fought with the dragon..." (Rev 12:7).
* "Be sober, be vigilant; because your adversary the devil walks about like a roaring lion..." (1 Pet 5:8).
* Rev 12:4-9; Isa 14:12-14; Ezek 28:12-18; Gen 3; Rom 1:19-32; 5:12-21; 1 Cor 4:9; Heb 1:14.

### Application
We are part of a cosmic drama. Your daily choices matter in this conflict. Choose the side of the Victor – Jesus Christ, who has already defeated the enemy on the cross.

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Życie, śmierć i zmartwychwstanie Chrystusa': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Życie, śmierć i zmartwychwstanie Chrystusa**.

### Lekcja: Życie, śmierć i zmartwychwstanie Chrystusa
W życiu Chrystusa, doskonałym świadectwie posłuszeństwa woli Bożej, w Jego cierpieniu, śmierci i zmartwychwstaniu Bóg dostarczył jedynego środka zadośćuczynienia za grzech ludzki, aby ci, którzy z wiarą przyjmują to zadośćuczynienie, mogli mieć życie wieczne. Ta doskonała ofiara wywyższa sprawiedliwość prawa Bożego i Jego łaskawy charakter.

**Podstawa Biblijna:**
* "Bóg zaś daje dowód swojej miłości ku nam przez to, że kiedy byliśmy jeszcze grzesznikami, Chrystus za nas umarł" (Rz 5:8).
* "A jeśli Chrystus nie został wzbudzony, tedy daremne jest zwiastowanie nasze, daremna też wiara wasza" (1 Kor 15:14).
* J 3:16; Iz 53; 1 P 2:21.22; 1 Kor 15:3.4.20-22; 2 Kor 5:14.15.19-21.

### Zastosowanie
Twoje zbawienie jest darmowym darem. Jezus zapłacił pełną cenę za Twoją wolność. Dzisiaj możesz odpocząć w Jego dokonanym dziele, wiedząc, że śmierć została pokonana, a niebo stoi przed Tobą otworem.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Life, Death, and Resurrection of Christ**.

### Lesson: The Life, Death, and Resurrection of Christ
In Christ’s life of perfect obedience to God’s will, His suffering, death, and resurrection, God provided the only means of atonement for human sin, so that those who by faith accept this atonement may have eternal life. This perfect sacrifice vindicates the justice of God’s law and the graciousness of His character.

**Biblical Foundation:**
* "But God demonstrates His own love toward us, in that while we were still sinners, Christ died for us" (Rom 5:8).
* "And if Christ is not risen, then our preaching is empty and your faith is also empty" (1 Cor 15:14).
* John 3:16; Isa 53; 1 Pet 2:21, 22; 1 Cor 15:3, 4, 20-22; 2 Cor 5:14, 15, 19-21.

### Application
Your salvation is a free gift. Jesus paid the full price for your freedom. Today, you can rest in His finished work, knowing that death has been defeated and heaven is open to you.

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Doświadczenie zbawienia': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Doświadczenie zbawienia**.

### Lekcja: Doświadczenie zbawienia
W nieskończonej miłości i miłosierdziu Bóg uczynił Chrystusa, który nie znał grzechu, grzechem za nas, abyśmy w Nim stali się sprawiedliwością Bożą. Prowadzeni przez Ducha Świętego dostrzegamy naszą potrzebę, wyznajemy naszą grzeszność i upamiętujemy się z naszych przestępstw, a przez wiarę w Jezusa przyjmujemy zbawienie.

**Podstawa Biblijna:**
* "Łaską bowiem jesteście zbawieni przez wiarę, i to nie jest z was, jest to dar Boży" (Ef 2:8).
* "On zaś, gdy przyjdzie, przekona świat o grzechu..." (J 16:8).
* 2 Kor 5:17-21; J 3:16; Gal 1:4; 4:4-7; Ef 2:4-10; Kol 1:13.14; Tt 3:3-7.

### Zastosowanie
Zbawienie to nie tylko teoria, to doświadczenie pokoju i nowości życia. Jeśli przyjąłeś ten dar, jesteś nowym stworzeniem. Nie pozwól, aby Twoja przeszłość Cię definiowała – teraz definiuje Cię Boża łaska.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby podziękować Bogu za to objawienie.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Experience of Salvation**.

### Lesson: The Experience of Salvation
In infinite love and mercy God made Christ, who knew no sin, to be sin for us, so that in Him we might be made the righteousness of God. Led by the Holy Spirit we sense our need, acknowledge our sinfulness, repent of our transgressions, and exercise faith in Jesus as Savior and Lord.

**Biblical Foundation:**
* "For by grace you have been saved through faith, and that not of yourselves; it is the gift of God" (Eph 2:8).
* "And when He has come, He will convict the world of sin..." (John 16:8).
* 2 Cor 5:17-21; John 3:16; Gal 1:4; 4:4-7; Eph 2:4-10; Col 1:13, 14; Titus 3:3-7.

### Application
Salvation is not just a theory; it is an experience of peace and newness of life. If you have accepted this gift, you are a new creation. Don't let your past define you – God's grace defines you now.

---
Do it for Jesus - He is already waiting. Take time today to thank God for this revelation.`
    },
    'Wzrastanie w Chrystusie': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Wzrastanie w Chrystusie**.

### Lekcja: Wzrastanie w Chrystusie
Przez śmierć na krzyżu Jezus zwyciężył moce zła. On, który podczas swej ziemskiej misji zwyciężył duchy demoniczne, przełamał ich potęgę i uczynił pewnym ich ostateczny los. Zwycięstwo Jezusa daje nam zwycięstwo nad siłami zła, które wciąż starają się nas kontrolować. Teraz, żyjąc w Nim, trwamy w pokoju i ufności.

Wzrastanie w Chrystusie to codzienne poddawanie woli Bogu, modlitwa, studiowanie Słowa i świadczenie o Jego łasce.

**Podstawa Biblijna:**
* "Wszystko mogę w Tym, który mnie umacnia" (Flp 4:13).
* "Wzrastajcie zaś w łasce i poznaniu Pana naszego i Zbawiciela, Jezusa Chrystusa" (2 P 3:18).
* Ps 1:1, 2; 23:4; Łk 10:17-20; J 20:21; Rz 8:31-39; Kol 1:13, 14.

### Zastosowanie
Czy czujesz się czasem przytłoczony walką duchową? Pamiętaj, że Jezus już zwyciężył. Twoim zadaniem nie jest wygrywanie wojny o własных siłach, ale trwanie w Zwycięzcy. Rozmawiaj dziś z Nim o każdym swoim lęku.

---
Zrób to Dla Jezusa - On już czeka. Poświęć dziś czas, aby wzrastać w Jego obecności.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Growing in Christ**.

### Lesson: Growing in Christ
By His death on the cross Jesus triumphed over the forces of evil. He who subjugated the demonic spirits during His earthly ministry has broken their power and made certain their ultimate doom. Jesus’ victory gives us victory over the evil forces that still seek to control us. Now we walk in the light and peace of His presence.

Growing in Christ means daily submission to His will, prayer, studying the Word, and witnessing to His grace.

**Biblical Foundation:**
* "I can do all things through Christ who strengthens me" (Phil 4:13).
* "But grow in the grace and knowledge of our Lord and Savior Jesus Christ" (2 Pet 3:18).
* Ps 1:1, 2; 23:4; Luke 10:17-20; John 20:21; Rom 8:31-39; Col 1:13, 14.

### Application
How does this principle affect your daily life? Do you see the character of a loving Creator in it?

---
Do it for Jesus - He is already waiting. Take time today to grow in His presence.`
    },
    'Kościół Boży': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Kościół Boży**.

### Lekcja: Kościół Boży
Kościół jest wspólnotą wierzących, którzy wyznają Jezusa Chrystusa jako Pana i Zbawiciela. Kontynuując starotestamentowy lud Boży, jesteśmy powołani ze świata i łączymy się dla wspólnego uwielbienia, dla społeczności, dla nauki Słowa Bożego, dla sprawowania Wieczerzy Pańskiej, dla służby całej ludzkości i dla ogłaszania Ewangelii całemu światu.

Kościół jest Ciałem Chrystusa, wspólnotą wiary, której On sam jest Głową.

**Podstawa Biblijna:**
* "A On jest Głową Ciała, Kościoła" (Kol 1:18).
* "Wy zaś jesteście ciałem Chrystusowym, a z osobna członkami" (1 Kor 12:27).
* Rdz 12:1-3; Wj 19:3-7; Mt 16:13-20; 18:18; Ef 1:22, 23; 2:19-22.

### Zastosowanie
Nie zostałeś powołany do samotności. Jesteś częścią wielkiej, Bożej rodziny. Twoje dary są potrzebne innym, a Ty potrzebujesz wsparcia braci i sióstr. Szukaj dziś okazji do budowania jedności w swojej wspólnocie.

---
Zrób to Dla Jezusa - On już czeka. Bądź żywym członkiem Jego Ciała.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Church**.

### Lesson: The Church
The church is the community of believers who confess Jesus Christ as Lord and Savior. In continuity with the people of God in Old Testament times, we are called out from the world; and we join together for worship, for fellowship, for instruction in the Word, for the celebration of the Lord’s Supper, for service to humanity, and for the worldwide proclamation of the gospel.

The church is the body of Christ, a community of faith of which He Himself is the Head.

**Biblical Foundation:**
* "And He is the head of the body, the church" (Col 1:18).
* "Now you are the body of Christ, and members individually" (1 Cor 12:27).
* Gen 12:1-3; Exod 19:3-7; Matt 16:13-20; 18:18; Eph 1:22, 23; 2:19-22.

### Application
You were not called to be alone. You are part of a great, divine family. Your gifts are needed by others, and you need the support of your brothers and sisters. Look for opportunities today to build unity in your community.

---
Do it for Jesus - He is already waiting. Be a living member of His Body.`
    },
    'Ostatek i jego misja': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Ostatek i jego misja**.

### Lekcja: Ostatek i jego misja
Powszechny Kościół składa się ze wszystkich, którzy prawdziwie wierzą w Chrystusa. Jednak w dniach ostatecznych, w czasie powszechnego odstępstwa, powołany został ostatek, aby zachowywać przykazania Boże i wiarę Jezusa. Ten ostatek ogłasza nadejście godziny sądu, głosi zbawienie przez Chrystusa i zapowiada bliskość Jego powtórnego przyjścia.

Misja ta jest symbolizowana przez trzech aniołów z 14. rozdziału Objawienia Jana.

**Podstawa Biblijna:**
* "Tu się okaże wytrwanie świętych, którzy przestrzegają przykazań Bożych i wiary Jezusa" (Obj 14:12).
* "I rozgniewał się smok na niewiastę, i odszedł, by podjąć walkę z resztą jej potomstwa..." (Obj 12:17).
* 2 Kor 5:10; Obj 14:6-12; 18:1-4; 2 P 3:10-14.

### Zastosowanie
Czy słyszysz Boże wołanie do wierności w świecie pełnym kompromisów? Jako część ostatka jesteś posłańcem nadziei. Nie bój się stać przy prawdzie, nawet gdy większość idzie w inną stronę. Twoja wierność ma znaczenie wieczne.

---
Zrób to Dla Jezusa - On już czeka. Nieś światło w ciemnościach.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Remnant and Its Mission**.

### Lesson: The Remnant and Its Mission
The universal church is composed of all who truly believe in Christ, but in the last days, a time of widespread apostasy, a remnant has been called out to keep the commandments of God and the faith of Jesus. This remnant announces the arrival of the judgment hour, proclaims salvation through Christ, and heralds the approach of His second advent.

This mission is symbolized by the three angels of Revelation 14.

**Biblical Foundation:**
* "Here is the patience of the saints; here are those who keep the commandments of God and the faith of Jesus" (Rev 14:12).
* "And the dragon was enraged with the woman, and he went to make war with the rest of her offspring..." (Rev 12:17).
* 2 Cor 5:10; Rev 14:6-12; 18:1-4; 2 Pet 3:10-14.

### Application
Do you hear God's call to faithfulness in a world full of compromise? As part of the remnant, you are a messenger of hope. Do not be afraid to stand for the truth, even when the majority goes the other way. Your faithfulness has eternal significance.

---
Do it for Jesus - He is already waiting. Carry the light in the darkness.`
    },
    'Jedność Ciała Chrystusa': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Jedność Ciała Chrystusa**.

### Lekcja: Jedność Ciała Chrystusa
Kościół jest jednym ciałem z wieloma członkami, powołanymi z każdego narodu, pokolenia, języka i ludu. W Chrystusie jesteśmy nowym stworzeniem; różnice rasy, kultury, wykształcenia, narodowości, a także różnice między wysokim i niskim stanem, bogatym i biednym, mężczyzną i kobietą, nie powinny nas dzielić.

Wszyscy jesteśmy równi w Chrystusie, który przez jednego Ducha złączył nas w jedną społeczność z Nim i ze sobą nawzajem.

**Podstawa Biblijna:**
* "Nie masz Żyda ani Greka... albowiem wy wszyscy jedno jesteście w Chrystusie Jezusie" (Gal 3:28).
* "Starając się zachować jedność Ducha w pomostu pokoju" (Ef 4:3).
* Ps 133:1; 1 Kor 12:12-14; 2 Kor 5:16, 17; Gal 3:27-29.

### Zastosowanie
Jedność nie oznacza jednolitości. Bóg kocha różnorodność, ale nienawidzi podziałów. Czy w Twoim sercu są bariery wobec innych ludzi? Proś dziś Pana, aby pomógł Ci widzieć innych Jego oczami – jako braci i siostry w tej samej rodzinie.

---
Zrób to Dla Jezusa - On już czeka. Buduj mosty, nie mury.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Unity in the Body of Christ**.

### Lesson: Unity in the Body of Christ
The church is one body with many members, called from every nation, kindred, tongue, and people. In Christ we are a new creation; distinctions of race, culture, learning, and nationality, and differences between high and low, rich and poor, male and female, must not be divisive among us.

We are all equal in Christ, who by one Spirit has bonded us into one fellowship with Him and with one another.

**Biblical Foundation:**
* "There is neither Jew nor Greek... for you are all one in Christ Jesus" (Gal 3:28).
* "Endeavoring to keep the unity of the Spirit in the bond of peace" (Eph 4:3).
* Ps 133:1; 1 Kor 12:12-14; 2 Cor 5:16, 17; Gal 3:27-29.

### Application
Unity does not mean uniformity. God loves diversity but hates division. Are there barriers in your heart against other people? Ask the Lord today to help you see others through His eyes – as brothers and sisters in the same family.

---
Do it for Jesus - He is already waiting. Build bridges, not walls.`
    },
    'Chrzest': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Chrzest**.

### Lekcja: Chrzest
Przez chrzest wyznajemy naszą wiarę w śmierć i zmartwychwstanie Jezusa Chrystusa oraz świadczymy o naszym uśmierceniu dla grzechu i o zamiarze chodzenia w odnowionym życiu. W ten sposób uznajemy Chrystusa jako Pana i Zbawiciela, stajemy się Jego ludem i zostajemy przyjęci w poczet członków Jego Kościoła.

Chrzest jest symbolem naszego połączenia z Chrystusem, przebaczenia grzechów i otrzymania Ducha Świętego. Jest on sprawowany przez zanurzenie w wodzie i jest uwarunkowany wyznaniem wiary w Jezusa oraz dowodami upamiętania.

**Podstawa Biblijna:**
* "Idźcie więc i nauczajcie wszystkie narody, udzielając im chrztu w imię Ojca i Syna, i Ducha Świętego" (Mt 28:19).
* "Kto uwierzy i ochrzczony zostanie, będzie zbawiony" (Mk 16:16).
* Mt 3:13-17; Rz 6:1-6; Kol 2:12, 13; Dz 2:38; 8:36-39; 16:30-33; 22:16.

### Zastosowanie
Czy Twój chrzest był momentem, w którym świadomie oddałeś życie Jezusowi? Jeśli jeszcze tego nie zrobiłeś, pamiętaj, że to publiczna deklaracja miłości i wierności Twojemu Zbawicielowi. To brama do nowej tożsamości.

---
Zrób to Dla Jezusa - On już czeka. Niech Twoje życie świadczy o Jego mocy.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Baptism**.

### Lesson: Baptism
By baptism we confess our faith in the death and resurrection of Jesus Christ, and testify of our death to sin and of our purpose to walk in newness of life. Thus we acknowledge Christ as Lord and Savior, become His people, and are received as members by His church.

Baptism is a symbol of our union with Christ, the forgiveness of our sins, and our reception of the Holy Spirit. It is by immersion in water and is contingent on an affirmation of faith in Jesus and evidence of repentance of sin.

**Biblical Foundation:**
* "Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit" (Matt 28:19).
* "He who believes and is baptized will be saved" (Mark 16:16).
* Matt 3:13-17; Rom 6:1-6; Col 2:12, 13; Acts 2:38; 8:36-39; 16:30-33; 22:16.

### Application
Was your baptism a moment when you consciously gave your life to Jesus? If you haven't done it yet, remember it's a public declaration of love and loyalty to your Savior. It's the gateway to a new identity.

---
Do it for Jesus - He is already waiting. Let your life testify to His power.`
    },
    'Wieczerza Pańska': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Wieczerza Pańska**.

### Lekcja: Wieczerza Pańska
Wieczerza Pańska jest uczestnictwem w symbolach ciała i krwi Jezusa, wyrażonych przez chleb i owoc winny. Jest ona wyrazem wiary w Pana jako Zbawiciela. W czasie obrzędu Wieczerzy Chrystus jest obecny przez Ducha, by spotykać się ze swym ludem i umacniać go. Sprawowanie Wieczerzy poprzedzone jest obrzędem umywania nóg, który jest symbolem ponownego oczyszczenia i wyrazem gotowości do służby braterskiej w pokorze Chrystusowej.

Nabożeństwo to jest pamiątką ofiary Jezusa i zapowiedzią Jego powtórnego przyjścia.

**Podstawa Biblijna:**
* "To czyńcie na pamiątkę moją" (1 Kor 11:24, 25).
* "Jeśli ja więc, Pan i Nauczyciel, umyłem nogi wasze, i wy powinniście sobie nawzajem nogi umywać" (J 13:14).
* Mt 26:17-30; 1 Kor 10:16, 17; J 6:33-63; Obj 19:9.

### Zastosowanie
Kiedy ostatnio klękałeś, by służyć bratu lub siostrze? Wieczerza to nie tylko rytuał, to stanięcie twarzą w twarz z miłością Chrystusa, która uniżyła się dla Ciebie. Przyjdź do stołu Pana z czystym sercem i gotowością do przebaczenia.

---
Zrób to Dla Jezusa - On już czeka. Świętuj Jego zwycięstwo.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Lord Supper**.

### Lesson: The Lord Supper
The Lord Supper is a participation in the emblems of the body and blood of Jesus as an expression of faith in Him, our Lord and Savior. In this experience of communion Christ is present to meet and strengthen His people. The service includes the ordinance of foot washing, signifying renewed cleansing and an expression of willingness to serve one another in Christ-like humility.

The communion service is a memorial of the sacrifice of Jesus and a proclamation of His second coming.

**Biblical Foundation:**
* "This do in remembrance of Me" (1 Cor 11:24, 25).
* "If I then, your Lord and Teacher, have washed your feet, you also ought to wash one another’s feet" (John 13:14).
* Matt 26:17-30; 1 Cor 10:16, 17; John 6:33-63; Rev 19:9.

### Application
When was the last time you knelt to serve a brother or sister? Communion is not just a ritual; it's standing face to face with the love of Christ, who humbled Himself for you. Come to the Lord's table with a pure heart and a readiness to forgive.

---
Do it for Jesus - He is already waiting. Celebrate His victory.`
    },
    'Dary i posługi duchowe': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Dary i posługi duchowe**.

### Lekcja: Dary i posługi duchowe
Bóg udziela wszystkim członkom swego Kościoła w każdym wieku darów duchowych, które każdy z nich powinien wykorzystywać w służbie miłości dla wspólnego dobra Kościoła i ludzkości. Dary te, udzielane przez Ducha Świętego, obejmują takie posługi jak wiara, uzdrawianie, proroctwo, głoszenie, nauczanie, administracja, pojednanie, współczucie oraz ofiarna pomoc bliźnim.

Niektórzy członkowie zostają powołani przez Boga i wyposażeni przez Ducha do szczególnych funkcji duszpasterskich, ewangelizacyjnych i nauczycielskich.

**Podstawa Biblijna:**
* "A dary są różne, lecz Duch ten sam" (1 Kor 12:4).
* "I On ustanowił jednych apostołami, drugich prorokami... dla budowania Ciała Chrystusowego" (Ef 4:11, 12).
* Rz 12:4-8; 1 Kor 12:9-11, 27, 28; Ef 4:8; Dz 6:1-7; 1 Tm 3:1-13.

### Zastosowanie
Bóg nie daje darów dla Twojej chwały, ale dla pożytku innych. Czy wiesz, jaki dar złożył w Tobie Duch Święty? Nie zakopuj swoich talentów. Każda, nawet najmniejsza służba, ma znaczenie w budowaniu Królestwa Bożego.

---
Zrób to Dla Jezusa - On już czeka. Odkryj i użyj swojego daru.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Spiritual Gifts and Ministries**.

### Lesson: Spiritual Gifts and Ministries
God bestows upon all members of His church in every age spiritual gifts, which each member is to employ in loving ministry for the common good of the church and of humanity. Given by the Holy Spirit, these gifts include such ministries as faith, healing, prophecy, proclamation, teaching, administration, reconciliation, compassion, and self-sacrificing service for the help and encouragement of people.

Some members are called by God and endowed by the Spirit for functions recognized by the church in pastoral, evangelistic, and teaching ministries.

**Biblical Foundation:**
* "There are diversities of gifts, but the same Spirit" (1 Cor 12:4).
* "And He Himself gave some to be apostles, some prophets... for the edifying of the body of Christ" (Eph 4:11, 12).
* Rom 12:4-8; 1 Cor 12:9-11, 27, 28; Eph 4:8; Acts 6:1-7; 1 Tim 3:1-13.

### Application
God does not give gifts for your glory, but for the benefit of others. Do you know what gift the Holy Spirit has placed in you? Do not bury your talents. Every service, even the smallest, matters in building the Kingdom of God.

---
Do it for Jesus - He is already waiting. Discover and use your gift.`
    },
    'Dar proroctwa': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Dar proroctwa**.

### Lekcja: Dar proroctwa
Pismo Święte świadczy, że jednym z darów Ducha Świętego jest proroctwo. Dar ten jest jednym z wyróżniających znamion Kościoła ostatka i objawił się w posłannictwie Ellen G. White. Jej pisma, jako posłańczyni Pańskiej, są stałym i autorytatywnym źródłem prawdy, niosącym Kościołowi pociechę, prowadzenie, pouczenie i skarcenie.

Wyraźnie też stwierdzają, że Biblia jest jedyną miarą, według której należy oceniać wszelkie nauczanie i doświadczenie.

**Podstawa Biblijna:**
* "Uwierzcie prorokom jego, a poszczęści się wam" (2 Krn 20:20).
* "Proroctwa nie lekceważcie" (1 Tes 5:20).
* Jl 2:28, 29; Dz 2:14-21; Hbr 1:1-3; Obj 12:17; 19:10.

### Zastosowanie
Bóg nie przestał przemawiać do swojego ludu. Ceniąc dar proroctwa, zyskujemy głębsze zrozumienie Biblii i czasu, w którym żyjemy. Czy czytasz natchnione pisma, które przybliżają Cię do Jezusa?

---
Zrób to Dla Jezusa - On już czeka. Słuchaj głosu natchnienia.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Gift of Prophecy**.

### Lesson: The Gift of Prophecy
The Scriptures testify that one of the gifts of the Holy Spirit is prophecy. This gift is an identifying mark of the remnant church and was manifested in the ministry of Ellen G. White. As the Lord’s messenger, her writings are a continuing and authoritative source of truth which provide for the church comfort, guidance, instruction, and correction.

They also make clear that the Bible is the standard by which all teaching and experience must be tested.

**Biblical Foundation:**
* "Believe His prophets, and you shall prosper" (2 Chron 20:20).
* "Do not despise prophecies" (1 Thess 5:20).
* Joel 2:28, 29; Acts 2:14-21; Heb 1:1-3; Rev 12:17; 19:10.

### Application
God has not stopped speaking to His people. By valuing the gift of prophecy, we gain a deeper understanding of the Bible and the time in which we live. Do you read inspired writings that bring you closer to Jesus?

---
Do it for Jesus - He is already waiting. Listen to the voice of inspiration.`
    },
    'Prawo Boże': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Prawo Boże**.

### Lekcja: Prawo Boże
Wielkie zasady prawa Bożego są zawarte w Dziesięciu Przykazaniach i uosobione w życiu Chrystusa. Wyrażają one miłość Boga, Jego wolę i cele dotyczące ludzkiego postępowania i relacji oraz obowiązują wszystkich ludzi we wszystkich wiekach. Przykazania te stanowią podstawę przymierza Boga z Jego ludem i są miernikiem Bożego sądu.

Przez działanie Ducha Świętego wskazują one na grzech i budzą potrzebę Zbawiciela. Zbawienie jest całkowicie z łaski, a nie z uczynków, ale jego owocem jest posłuszeństwo przykazaniom.

**Podstawa Biblijna:**
* "Jeśli mnie miłujecie, przykazań moich przestrzegać będziecie" (J 14:15).
* "Tu się okaże wytrwanie świętych, którzy przestrzegają przykazań Bożych..." (Obj 14:12).
* Wj 20:1-17; Ps 40:8, 9; Mt 5:17-20; Rz 3:20; 7:7.

### Zastosowanie
Prawo Boże nie jest ciężarem, ale ochroną. To drogowskaz pokazujący, jak kochać Boga i ludzi. Czy postrzegasz przykazania jako ograniczenie, czy jako wyraz Bożej troski o Twoje szczęście? Proś dziś o serce, które kocha Boże Prawo.

---
Zrób to Dla Jezusa - On już czeka. Żyj w wolności posłuszeństwa.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Law of God**.

### Lesson: The Law of God
The great principles of God’s law are embodied in the Ten Commandments and exemplified in the life of Christ. They express God’s love, will, and purposes concerning human conduct and relationships and are binding upon all people in every age. These precepts are the basis of God’s covenant with His people and the standard in His judgment.

Through the agency of the Holy Spirit they point out sin and awaken a sense of need for a Savior. Salvation is all of grace and not of works, and its fruit is obedience to the Commandments.

**Biblical Foundation:**
* "If you love Me, keep My commandments" (John 14:15).
* "Here is the patience of the saints; here are those who keep the commandments of God..." (Rev 14:12).
* Exod 20:1-17; Ps 40:8, 9; Matt 5:17-20; Rom 3:20; 7:7.

### Application
God's law is not a burden but a protection. It is a signpost showing how to love God and people. Do you perceive the commandments as a limitation or as an expression of God's concern for your happiness? Ask today for a heart that loves God's Law.

---
Do it for Jesus - He is already waiting. Live in the freedom of obedience.`
    },
    'Szabat': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Szabat**.

### Lekcja: Szabat
Dobrotliwy Stwórca po sześciu dniach stwarzania odpoczął siódmego dnia i ustanowił Szabat dla wszystkich ludzi jako pamiątkę stworzenia. Czwarte przykazanie niezmiennego prawa Bożego nakazuje zachowywanie siódmego dnia tygodnia, soboty, jako dnia odpoczynku, uwielbienia i służby, zgodnie z nauką i przykładem Jezusa, Pana Szabatu.

Szabat jest dniem radosnej społeczności z Bogiem i bliźnimi. Jest symbolem naszego odkupienia w Chrystusie, znakiem naszego uświęcenia, dowodem naszej wierności oraz przedsmakiem naszej wiecznej przyszłości w Królestwie Bożym.

**Podstawa Biblijna:**
* "Pamiętaj o dniu szabatu, aby go święcić" (Wj 20:8).
* "Szabat ustanowiony jest dla człowieka, a nie człowiek dla szabatu" (Mk 2:27).
* Rdz 2:1-3; Wj 31:12-17; Łk 4:16; Iz 58:13, 14; Hbr 4:1-11.

### Zastosowanie
Szabat to Boży prezent – czas zatrzymania w zabieganym świecie. Czy pozwalasz sobie na ten święty odpoczynek? To nie tylko zakaz pracy, to zaproszenie do zachwytu nad Bożym dziełem i do głębokiej relacji z Nim. Zaplanuj swój najbliższy Szabat jako czas radości.

---
Zrób to Dla Jezusa - On już czeka. Odpocznij w Jego miłości.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Sabbath**.

### Lesson: The Sabbath
The gracious Creator, after the six days of Creation, rested on the seventh day and instituted the Sabbath for all people as a memorial of Creation. The fourth commandment of God’s unchangeable law requires the observance of this seventh-day Sabbath as the day of rest, worship, and ministry in harmony with the teaching and practice of Jesus, the Lord of the Sabbath.

The Sabbath is a day of delightful communion with God and one another. It is a symbol of our redemption in Christ, a sign of our sanctification, a token of our allegiance, and a foretaste of our eternal future in God’s kingdom.

**Biblical Foundation:**
* "Remember the Sabbath day, to keep it holy" (Exod 20:8).
* "The Sabbath was made for man, and not man for the Sabbath" (Mark 2:27).
* Gen 2:1-3; Exod 31:12-17; Luke 4:16; Isa 58:13, 14; Heb 4:1-11.

### Application
The Sabbath is God's gift – a time to stop in a busy world. Do you allow yourself this holy rest? It's not just a prohibition of work; it's an invitation to marvel at God's work and to have a deep relationship with Him. Plan your next Sabbath as a time of joy.

---
Do it for Jesus - He is already waiting. Rest in His love.`
    },
    'Szafarstwo': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Szafarstwo**.

### Lekcja: Szafarstwo
Jesteśmy szafarzami Boga, którym powierzył On czas i okazje, możliwości i inteligencję oraz dobra ziemskie i zasoby ziemi. Odpowiadamy przed Nim za ich właściwe wykorzystanie. Boże prawo własności uznajemy przez wierną służbę Jemu i bliźnim oraz przez oddawanie dziesięcin i składanie dobrowolnych ofiar na rzecz ogłaszania Ewangelii i na wspieranie oraz rozwój Jego Kościoła.

Szafarstwo jest przywilejem danym nam przez Boga dla pielęgnowania miłości oraz dla zwycięstwa nad egoizmem i chciwością.

**Podstawa Biblijna:**
* "Przynieście całą dziesięcinę do spichlerza" (Mal 3:10).
* "Bóg miłuje radosnego dawcę" (2 Kor 9:7).
* Rdz 1:26-28; 2:15; Ag 1:3-11; 1 Kor 9:9-14; Mt 23:23.

### Zastosowanie
Wszystko, co masz, należy do Boga. Ty jesteś tylko zarządcą. Jak zarządzasz swoim czasem, talentami i pieniędzmi? Czy Twoje wydatki odzwierciedlają Twoje niebiańskie priorytety? Pamiętaj, że hojność uwalnia serce z niewoli materializmu.

---
Zrób to Dla Jezusa - On już czeka. Bądź wiernym szafarzem Jego dóbr.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Stewardship**.

### Lesson: Stewardship
We are God’s stewards, entrusted by Him with time and opportunities, abilities and possessions, and the blessings of the earth and its resources. We are responsible to Him for their proper use. We acknowledge God’s ownership by faithful service to Him and our fellow human beings, and by returning tithe and giving offerings for the proclamation of His gospel and the support and growth of His church.

Stewardship is a privilege given to us by God for our nurture in love and the victory over selfishness and covetousness.

**Biblical Foundation:**
* "Bring all the tithes into the storehouse" (Mal 3:10).
* "God loves a cheerful giver" (2 Cor 9:7).
* Gen 1:26-28; 2:15; Hag 1:3-11; 1 Cor 9:9-14; Matt 23:23.

### Application
Everything you have belongs to God. You are only the manager. How do you manage your time, talents, and money? Do your expenses reflect your heavenly priorities? Remember that generosity frees the heart from the bondage of materialism.

---
Do it for Jesus - He is already waiting. Be a faithful steward of His goods.`
    },
    'Chrześcijańskie zachowanie': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Chrześcijańskie prowadzenie się**.

### Lekcja: Chrześcijańskie prowadzenie się
Jesteśmy powołani, aby być ludem pobożnym, myślącym, czującym i działającym zgodnie z zasadami nieba. Dla Ducha Świętego, który odnawia w nas charakter naszego Pana, angażujemy się tylko w to, co przynosi chrześcijańską czystość, zdrowie i radość w naszym życiu. Oznacza to, że nasze rozrywki powinny odpowiadać najwyższym standardom chrześcijańskiego smaku i piękna.

Ponieważ nasze ciała są świątynią Ducha Świętego, musimy dbać o nie rozumnie, stosując odpowiednią dietę, ubiór oraz unikając wszystkiego, co szkodzi zdrowiu.

**Podstawa Biblijna:**
* "Czy jecie, czy pijecie, czy cokolwiek innego czynicie, wszystko na chwałę Bożą czyńcie" (1 Kor 10:31).
* "Ciało wasze jest świątynią Ducha Świętego" (1 Kor 6:19).
* Rz 12:1, 2; 1 J 2:6; Ef 5:1-21; Flp 4:8; 2 Kor 10:5.

### Zastosowanie
Twoje życie jest jedyną Biblią, którą niektórzy ludzie kiedykolwiek przeczytają. Czy Twoje wybory – to co oglądasz, co jesz, jak się ubierasz – zachęcają innych do poznania Jezusa? Pamiętaj, że Boże standardy nie mają nas ograniczać, ale pozwolić nam żyć pełnią życia.

---
Zrób to Dla Jezusa - On już czeka. Bądź Jego godnym ambasadorem.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Christian Behavior**.

### Lesson: Christian Behavior
We are called to be a godly people who think, feel, and act in harmony with the principles of heaven. For the Spirit to recreate in us the character of our Lord we involve ourselves only in those things which will produce Christ-like purity, health, and joy in our lives. This means that our amusement and entertainment should meet the highest standards of Christian taste and beauty.

Because our bodies are the temples of the Holy Spirit, we are to care for them intelligently, applying proper diet and dress, and avoiding anything that harms health.

**Biblical Foundation:**
* "Whether you eat or drink, or whatever you do, do all to the glory of God" (1 Cor 10:31).
* "Your body is the temple of the Holy Spirit" (1 Cor 6:19).
* Rom 12:1, 2; 1 John 2:6; Eph 5:1-21; Phil 4:8; 2 Cor 10:5.

### Application
Your life is the only Bible some people will ever read. Do your choices – what you watch, what you eat, how you dress – encourage others to know Jesus? Remember that God's standards are not meant to limit us but to allow us to live life to the fullest.

---
Do it for Jesus - He is already waiting. Be His worthy ambassador.`
    },
    'Małżeństwo i rodzina': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Małżeństwo i rodzina**.

### Lekcja: Małżeństwo i rodzina
Małżeństwo zostało ustanowione przez Boga w Edenie i potwierdzone przez Jezusa jako dożywotni związek między mężczyzną i kobietą w miłości i oddaniu. Dla chrześcijanina zobowiązanie małżeńskie jest złożone zarówno Bogu, jak i współmałżonkowi i powinno być zawierane tylko między osobami tej samej wiary.

Rodzina jest podstawową komórką społeczeństwa, w której dzieci powinny wzrastać w miłości i posłuszeństwie Panu. Budowanie zdrowych relacji rodzinnych jest jednym z wyróżniających znamion końcowego poselstwa Ewangelii.

**Podstawa Biblijna:**
* "Dlatego opuści mąż ojca swego i matkę swoją i połączy się z żoną swoją" (Rdz 2:24).
* "Co Bóg złączył, człowiek niech nie rozdziela" (Mt 19:6).
* Rdz 2:18-25; Ef 5:21-33; Mt 5:31, 32; Mal 4:5, 6; Ef 6:1-4.

### Zastosowanie
Twoja rodzina to Twoje pierwsze pole misyjne. Czy okazujesz miłość i cierpliwość tym, którzy są Ci najbliżsi? Małżeństwo to obraz relacji Chrystusa z Kościołem – pełnej poświęcenia i wierności. Pracuj dziś nad umocnieniem więzi z najbliższymi.

---
Zrób to Dla Jezusa - On już czeka. Buduj dom na Skale.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Marriage and the Family**.

### Lesson: Marriage and the Family
Marriage was divinely established in Eden and affirmed by Jesus to be a lifelong union between a man and a woman in loving companionship. For the Christian a marriage commitment is to God as well as to the spouse, and should be entered into only between partners who share a common faith.

The family is the basic unit of society, in which children are to be brought up in the love and admonition of the Lord. Building healthy family relationships is one of the hallmarks of the final gospel message.

**Biblical Foundation:**
* "Therefore a man shall leave his father and mother and be joined to his wife" (Gen 2:24).
* "What God has joined together, let not man separate" (Matt 19:6).
* Gen 2:18-25; Eph 5:21-33; Matt 5:31, 32; Mal 4:5, 6; Eph 6:1-4.

### Application
Your family is your first mission field. Do you show love and patience to those who are closest to you? Marriage is a picture of Christ’s relationship with the Church – full of sacrifice and loyalty. Work today on strengthening your bonds with your loved ones.

---
Do it for Jesus - He is already waiting. Build your home on the Rock.`
    },
    'Służba Chrystusa w niebiańskiej świątyni': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Służba Chrystusa w niebiańskiej świątyni**.

### Lekcja: Służba Chrystusa w niebiańskiej świątyni
W niebie znajduje się świątynia, prawdziwy przybytek, który Pan zbudował, a nie człowiek. Tam Chrystus usługuje w naszym zastępstwie, udostępniając wierzącym owoce Swej odkupieńczej ofiary złożonej raz na zawsze na krzyżu. Po swym wniebowstąpieniu został On ustanowiony naszym Wielkim Arcykapłanem i rozpoczął Swą służbę wstawienniczą.

W roku 1844, przy końcu proroczego okresu 2300 dni, rozpoczął się drugi i ostatni etap Jego służby pojednawczej – sąd śledczy, który jest częścią ostatecznego rozprawienia się z grzechem.

**Podstawa Biblijna:**
* "Mamy takiego arcykapłana, który usiadł po prawicy tronu Majestatu w niebie" (Hbr 8:1).
* "Aż do dwóch tysięcy trzystu wieczorów i poranków; wtedy świątynia zostanie oczyszczona" (Dn 8:14).
* Hbr 4:14-16; 9:11-28; 10:19-22; Obj 1:5; 11:19.

### Zastosowanie
Czy masz świadomość, że w tej chwili Jezus wstawia się za Tobą przed Ojcem? Nie jesteś sam ze swoimi słabościami. Twój Obrońca zna Twoje imię i walczy o Twoje zbawienie. Przyjdź z ufnością do tronu łaski, aby otrzymać pomoc w stosownej porze.

---
Zrób to Dla Jezusa - On już czeka. Zaufaj swojemu Arcykapłanowi.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Christ Ministry in the Heavenly Sanctuary**.

### Lesson: Christ Ministry in the Heavenly Sanctuary
There is a sanctuary in heaven, the true tabernacle that the Lord set up and not man. In it Christ ministers on our behalf, making available to believers the benefits of His atoning sacrifice offered once for all on the cross. At His ascension, He was inaugurated as our great High Priest and began His intercessory ministry.

In 1844, at the end of the prophetic period of 2300 days, He entered the second and last phase of His atoning ministry – a work of investigative judgment which is part of the ultimate disposition of all sin.

**Biblical Foundation:**
* "We have such a High Priest, who is seated at the right hand of the throne of the Majesty in the heavens" (Heb 8:1).
* "For two thousand three hundred days; then the sanctuary shall be cleansed" (Dan 8:14).
* Heb 4:14-16; 9:11-28; 10:19-22; Rev 1:5; 11:19.

### Application
Are you aware that right now Jesus is interceding for you before the Father? You are not alone with your weaknesses. Your Advocate knows your name and fights for your salvation. Come boldly to the throne of grace, that you may obtain mercy and find grace to help in time of need.

---
Do it for Jesus - He is already waiting. Trust your High Priest.`
    },
    'Powtórne przyjście Chrystusa': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Powtórne przyjście Chrystusa**.

### Lekcja: Powtórne przyjście Chrystusa
Powtórne przyjście Chrystusa jest błogosławioną nadzieją Kościoła i wspaniałym ukoronowaniem Ewangelii. Przyjście Zbawiciela będzie literalne, osobiste, widzialne i ogólnoświatowe. Gdy On powróci, sprawiedliwi umarli zostaną wskrzeszeni i wraz ze sprawiedliwymi żyjącymi zostaną uwielbieni i zabrani do nieba, natomiast niesprawiedliwi umrą.

Wypełnienie się większości proroctw oraz obecny stan świata wskazują na to, że przyjście Chrystusa jest bliskie. Czas tego wydarzenia nie został objawiony, dlatego jesteśmy wezwani do stałej gotowości.

**Podstawa Biblijna:**
* "Oto przychodzę wkrótce, a zapłata moja jest ze mną" (Obj 22:12).
* "Ten Jezus... tak przyjdzie, jak go widzieliście idącego do nieba" (Dz 1:11).
* Mt 24; Mk 13; Łk 21; J 14:1-3; 1 Tes 4:13-18; Tyt 2:13.

### Zastosowanie
Czy Twoje serce tęskni za spotkaniem z Królem? Powtórne przyjście to nie powód do strachu, ale do wielkiej radości dla tych, którzy Go kochają. Żyj tak, jakby Jezus miał powrócić dzisiaj – z miłością w sercu i gotowością na Jego wezwanie.

---
Zrób to Dla Jezusa - On już czeka. Marana tha – Przyjdź, Panie Jezu!`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Second Coming of Christ**.

### Lesson: The Second Coming of Christ
The second coming of Christ is the blessed hope of the church, the grand climax of the gospel. The Savior’s coming will be literal, personal, visible, and worldwide. When He returns, the righteous dead will be resurrected, and together with the righteous living will be glorified and caught up to meet their Lord, but the unrighteous will die.

The almost complete fulfillment of most lines of prophecy, together with the present condition of the world, indicates that Christ’s coming is near. The time of that event has not been revealed, and we are therefore exhorted to be ready at all times.

**Biblical Foundation:**
* "Look, I am coming soon! My reward is with me" (Rev 22:12).
* "This same Jesus... will come back in the same way you have seen him go into heaven" (Acts 1:11).
* Matt 24; Mark 13; Luke 21; John 14:1-3; 1 Thess 4:13-18; Titus 2:13.

### Application
Does your heart long to meet the King? The Second Coming is not a cause for fear, but for great joy for those who love Him. Live as if Jesus were to return today – with love in your heart and readiness for His call.

---
Do it for Jesus - He is already waiting. Maranatha – Come, Lord Jesus!`
    },
    'Śmierć i zmartwychwstanie': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Śmierć i zmartwychwstanie**.

### Lekcja: Śmierć i zmartwychwstanie
Zapłatą za grzech jest śmierć. Ale Bóg, który jedyny jest nieśmiertelny, udzieli życia wiecznego swoim odkupionym. Do dnia powrotu Chrystusa śmierć jest dla wszystkich ludzi stanem nieświadomości. Gdy Chrystus, który jest naszym życiem, się pojawi, wskrzeszeni sprawiedliwi oraz żyjący sprawiedliwi zostaną uwielbieni i porwani na spotkanie swego Pana.

Drugie zmartwychwstanie, zmartwychwstanie niesprawiedliwych, nastąpi tysiąc lat później.

**Podstawa Biblijna:**
* "Żyjący wiedzą, że umrą, ale umarli nic nie wiedzą" (Koh 9:5).
* "Bo zapłatą za grzech jest śmierć, lecz darem łaski Bożej jest żywot wieczny" (Rz 6:23).
* 1 Tm 6:15, 16; 1 Tes 4:13-17; Ps 146:3, 4; J 11:11-14; 1 Kor 15:51-54.

### Zastosowanie
Śmierć nie ma ostatniego słowa. Dla chrześcijanina jest ona tylko snem, z którego obudzi nas głos Jezusa. Czy boisz się przemijania? Pamiętaj, że Twoje życie jest ukryte w Chrystusie, który zwyciężył śmierć. Ta nadzieja pozwala nam patrzeć w przyszłość z pokojem.

---
Zrób to Dla Jezusa - On już czeka. Śmierć została pokonana!`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **Death and Resurrection**.

### Lesson: Death and Resurrection
The wages of sin is death. But God, who alone is immortal, will grant eternal life to His redeemed. Until the return of Christ, death is an unconscious state for all people. When Christ, who is our life, appears, the resurrected righteous and the living righteous will be glorified and caught up to meet their Lord.

The second resurrection, the resurrection of the unrighteous, will take place a thousand years later.

**Biblical Foundation:**
* "For the living know that they will die, but the dead know nothing" (Eccl 9:5).
* "For the wages of sin is death, but the gift of God is eternal life" (Rom 6:23).
* 1 Tim 6:15, 16; 1 Thess 4:13-17; Ps 146:3, 4; John 11:11-14; 1 Cor 15:51-54.

### Application
Death does not have the last word. For a Christian, it is only a sleep from which the voice of Jesus will wake us. Are you afraid of passing away? Remember that your life is hidden in Christ, who conquered death. This hope allows us to look to the future with peace.

---
Do it for Jesus - He is already waiting. Death is defeated!`
    },
    'Tysiąclecie i koniec grzechu': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Tysiąclecie i koniec grzechu**.

### Lekcja: Tysiąclecie i koniec grzechu
Tysiąclecie jest okresem panowania Chrystusa z Jego świętymi w niebie, między pierwszym a drugim zmartwychwstaniem. W tym czasie dokonywany będzie sąd nad niesprawiedliwymi. Ziemia będzie całkowicie pusta, zamieszkała jedynie przez szatana i jego aniołów.

Przy końcu tego okresu Chrystus wraz ze swymi świętymi i Miastem Świętym zstąpi z nieba na ziemię. Wtedy niesprawiedliwi zostaną wskrzeszeni i wraz z szatanem otoczą miasto, ale ogień od Boga pochłonie ich i oczyści ziemię. Wszechświat na zawsze zostanie uwolniony od grzechu i grzeszników.

**Podstawa Biblijna:**
* "I będą kapłanami Boga i Chrystusa, i panować z nim będą przez tysiąc lat" (Obj 20:6).
* "A diabeł... został wrzucony do jeziora z ogniem" (Obj 20:10).
* Obj 20; 1 Kor 6:2, 3; Jr 4:23-26; Mal 4:1; 2 P 3:13.

### Zastosowanie
Bóg ostatecznie rozprawi się ze złem. Grzech nie będzie trwał wiecznie. Czy Twoje życie jest po stronie zwyciężającego Chrystusa? Wiara w sprawiedliwy sąd Boży daje nam siłę do znoszenia niesprawiedliwości, wiedząc, że ostatnie słowo należy do Boga miłości.

---
Zrób to Dla Jezusa - On już czeka. Zło przeminie na zawsze.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The Millennium and the End of Sin**.

### Lesson: The Millennium and the End of Sin
The millennium is the thousand-year reign of Christ with His saints in heaven between the first and second resurrections. During this time the wicked dead will be judged; the earth will be utterly desolate, without living human inhabitants, but occupied by Satan and his angels.

At its close Christ with His saints and the Holy City will descend from heaven to earth. The unrighteous dead will then be resurrected, and with Satan and his angels will encompass the city; but fire from God will consume them and cleanse the earth. The universe will thus be freed of sin and sinners forever.

**Biblical Foundation:**
* "And they lived and reigned with Christ for a thousand years" (Rev 20:4).
* "The devil... was cast into the lake of fire" (Rev 20:10).
* Rev 20; 1 Cor 6:2, 3; Jer 4:23-26; Mal 4:1; 2 Pet 3:13.

### Application
God will ultimately deal with evil. Sin will not last forever. Is your life on the side of the victorious Christ? Faith in God's righteous judgment gives us strength to endure injustice, knowing that the last word belongs to the God of love.

---
Do it for Jesus - He is already waiting. Evil will pass away forever.`
    },
    'Nowa Ziemia': {
      pl: `### Wprowadzenie
Rozważamy zasady wiary opierając się wyłącznie na Piśmie Świętym. Tematem dzisiejszej lekcji jest: **Nowa Ziemia**.

### Lekcja: Nowa Ziemia
Na Nowej Ziemi, gdzie mieszka sprawiedliwość, Bóg przygotuje wieczny dom dla odkupionych oraz doskonałe środowisko dla wiecznego życia, miłości, radości i nauki w Jego obecności. Tutaj sam Bóg będzie przebywał ze swym ludem, a śmierć, ból i cierpienie przeminą na zawsze.

Wielki bój zostanie zakończony i grzech więcej się nie pojawi. Wszystko, co ożywione i nieożywione, będzie ogłaszać, że Bóg jest miłością; i będzie On panować na wieki.

**Podstawa Biblijna:**
* "I widziałem nowe niebo i nową ziemię" (Obj 21:1).
* "I otrze wszelką łzę z oczu ich" (Obj 21:4).
* Iz 35; 65:17-25; Mt 5:5; 2 P 3:13; Obj 11:15; 22:1-5.

### Zastosowanie
Czy potrafisz sobie wyobrazić świat bez łez, chorób i pożegnań? To nie jest bajka, to Boża obietnica dla Ciebie. Niech wizja Nowej Ziemi dodaje Ci sił w trudnych chwilach. To, co najlepsze, jest jeszcze przed nami. Twoja ojczyzna jest w niebie.

---
Zrób to Dla Jezusa - On już czeka. Dom jest blisko.`,
      en: `### Introduction
We consider the principles of faith based solely on the Holy Scriptures. The topic of today's lesson is: **The New Earth**.

### Lesson: The New Earth
On the New Earth, in which righteousness dwells, God will provide an eternal home for the redeemed and a perfect environment for everlasting life, love, joy, and learning in His presence. For here God Himself will dwell with His people, and suffering and death will have passed away.

The great controversy will be ended, and sin will be no more. All things, animate and inanimate, will declare that God is love; and He shall reign forever.

**Biblical Foundation:**
* "Then I saw a new heaven and a new earth" (Rev 21:1).
* "He will wipe away every tear from their eyes" (Rev 21:4).
* Isa 35; 65:17-25; Matt 5:5; 2 Pet 3:13; Rev 11:15; 22:1-5.

### Application
Can you imagine a world without tears, sickness, and goodbyes? This is not a fairy tale; it is God's promise to you. Let the vision of the New Earth give you strength in difficult times. The best is yet to come. Your home is in heaven.

---
Do it for Jesus - He is already waiting. Home is near.`
    },

    'Moc Modlitwy': {
      pl: `### Wprowadzenie
Modlitwa to oddech dla duszy chrześcijanina. To nie tylko przedstawianie Bogu swoich próśb, ale intymna relacja, wymiana myśli i budowanie więzi z najlepszym Przyjacielem.

### Lekcja: Rozmowa z Ojcem
**1. Modlitwa jako Relacja:**  
W Ewangelii Mateusza 6:9, Jezus uczy nas: *"Wy więc tak się módlcie: Ojcze nasz..."*. Modlitwa zaczyna się od uświadomienia sobie naszej tożsamości. Jesteśmy dziećmi Boga, które przychodzą do Ojca.

**2. O co prosić?**
* **O Królestwo Boże:** Najpierw szukajcie wpierw Królestwa Bożego (Mt 6:33).
* **O chleb powszedni:** Nasze codzienne, zwykłe potrzeby obchodzą Boga (Flp 4:6).
* **O odpuszczenie win:** Modlitwa oczyszcza nas i zachowuje nas w łasce.

**3. Skuteczna modlitwa:**  
List Jakuba 5:16 mówi: *"Mocna jest i skuteczna modlitwa sprawiedliwego."*. Prawdziwa modlitwa to taka, która płynie z serca, nawet gdy brakuje nam słów. Duch Święty sam wstawia się za nami (Rz 8:26).

### Podsumowanie
Nie musisz używać skomplikowanych słów. Jezus chce Twojej szczerości.

---
Zrób to Dla Jezusa - On już czeka. Dzisiaj znajdź 5 minut, aby w ciszy powiedzieć Mu o tym, co naprawdę czujesz.`,
      en: `### Introduction
Prayer is the breath of the Christian soul. It is not just about presenting requests to God, but an intimate relationship, an exchange of thoughts, and building a bond with your best Friend.

### Lesson: Conversation with the Father
**1. Prayer as Relationship:**  
In Matthew 6:9, Jesus teaches us: *"Pray then like this: Our Father..."*. Prayer starts with recognizing our identity. We are children coming to our Father.

**2. What to ask for?**
* **For God's Kingdom:** Seek first the Kingdom of God (Mt 6:33).
* **For daily bread:** Our everyday, ordinary needs matter to God (Phil 4:6).
* **For forgiveness:** Prayer purifies us and keeps us in grace.

**3. Effective prayer:**  
James 5:16 says: *"The prayer of a righteous person has great power as it is working."*. True prayer flows from the heart, even when we lack words. The Holy Spirit intercedes for us (Rom 8:26).

### Summary
You don't need complex words. Jesus wants your honesty.

---
Do it for Jesus - He is already waiting. Today, find 5 minutes to sit in silence and tell Him how you truly feel.`
    },
    'Życie Słowem Bożym': {
      pl: `### Wprowadzenie
Słowo Boże (Biblia) nie jest tylko książką historyczną. Jest "żywe i skuteczne", zdolne przemieniać ludzkie życie.

### Lekcja: Pokarm dla duszy
**1. Biblia jest natchniona:**  
*"Całe Pismo przez Boga jest natchnione i pożyteczne do nauki, do wykrywania błędów..."* (2 Tm 3:16). Oznacza to, że sam Bóg stoi za każdym wpisanym tam słowem ratunku dla Ciebie.

**2. Światło mych ścieżek:**  
*"Słowo Twoje jest pochodnią nogom moim..."* (Ps 119:105). Kiedy tracisz kierunek w świecie pełnym zamieszania, Słowo Boże jest kompasem moralnym.

**3. Miecz Ducha:**  
W zbroi chrześcijanina z Listu do Efezjan (Ef 6:17), Słowo Boże jest jedyną bronią ofensywną – Mieczem Ducha. To nim odpieramy ataki i wątpliwości przeciwnika w czasie prób.

### Praktyka
Czytaj codziennie. Nawet jeden mały werset przemyślany przez cały dzień ma większą moc niż 10 przeczytanych w pośpiechu rozdziałów.

---
Zrób to Dla Jezusa - On już czeka. Otwórz dzisiaj swój ulubiony fragment i pomódl się nim.`,
      en: `### Introduction
The Word of God (the Bible) is not just a historical book. It is "living and active," capable of transforming human lives.

### Lesson: Food for the soul
**1. The Bible is inspired:**  
*"All Scripture is breathed out by God and profitable for teaching, for reproof..."* (2 Tim 3:16). This means God Himself stands behind every word of rescue written for you.

**2. A light to my path:**  
*"Your word is a lamp to my feet..."* (Ps 119:105). When you lose direction in a world full of confusion, the Word of God is your moral compass.

**3. The Sword of the Spirit:**  
In the Christian armor from Ephesians (Eph 6:17), the Word of God is the only offensive weapon – the Sword of the Spirit. With it, we fend off the enemy's attacks and doubts during trials.

### Practice
Read daily. Even a single short verse contemplated throughout the day has more power than 10 chapters read in a rush.

---
Do it for Jesus - He is already waiting. Open your favorite passage today and pray with it.`
    },

    'Dyscyplina Postu': {
      pl: `### Wprowadzenie
Post to nie sztuczne potępianie własnego ciała. To narzędzie dyscyplinowania ciała i duszy, aby nasz duch mógł wyraźniej słyszeć głos Boga.

### Lekcja: Jak pościć prawdziwie?
**1. Cel postu:**  
Kiedy się pościmy, odsuwamy to, co cielesne (jedzenie, rozrywkę, media), by móc karmić się tym, co duchowe. Jezus sam zachęcał do postu (Mt 6:16-18).

**2. Prawdziwy post w sercu:**  
Księga Izajasza (Iz 58:6) mówi jasno, jakiego postu domaga się Bóg: *"Czyż nie jest raczej ten post, który wybieram: To rozwiązać kajdany zła..."*. Post jest wtedy ważny, gdy łączysz go z miłością do bliźnich.

**3. Moc duchowa:**  
Post, wraz z modlitwą, przygotowuje nas do przełomów w wierze. To czas szczególnego poświęcenia Ducha Świętego.

### Zastosowanie
Zastanów się, czy jest jakaś mała przyjemność, czy chwila w social mediach, z której możesz dzisiaj zrezygnować na rzecz modlitwy.

---
Zrób to Dla Jezusa - On już czeka. Oddaj jedną rzecz dzisiaj, by zyskać bliższą relację z Nim.`,
      en: `### Introduction
Fasting is not an artificial condemnation of one's body. It is a tool to discipline the body and soul so our spirit can more clearly hear God's voice.

### Lesson: How to fast truly?
**1. The purpose of fasting:**  
When we fast, we push away fleshly things (food, entertainment, media), to feed on the spiritual. Jesus Himself encouraged fasting (Mt 6:16-18).

**2. True fasting from the heart:**  
Isaiah (Isa 58:6) clearly states what kind of fast God requires: *"Is not this the fast that I choose: to loose the bonds of wickedness..."*. Fasting is valid when combined with love for your neighbor.

**3. Spiritual power:**  
Fasting, paired with prayer, prepares us for breakthroughs in faith. It is a time of special consecration to the Holy Spirit.

### Application
Consider if there is some small pleasure, or a moment on social media, you can give up today for prayer.

---
Do it for Jesus - He is already waiting. Surrender one thing today to gain a closer relationship with Him.`
    },
    
    'Prowadzenie Ducha Świętego': {
      pl: `### Wprowadzenie
Chrześcijaństwo nie polega na stosowaniu surowych zasad lecz na poddaniu się żywej, aktywnej obecności Boga – Duchowi Świętemu.

### Lekcja: Życie w Duchu
**1. Nauczyciel i Pocieszyciel:**  
Jezus odszedł, ale obiecał: *"Gdy zaś przyjdzie on Duch Prawdy, wprowadzi was we wszelką prawdę..."* (J 16:13). Duch Święty nigdy Cię nie opuszcza.

**2. Rozróżnianie Głosów:**  
Głos Ducha Świętego przynosi Boży pokój i zachęca do miłości. Jak uczy Galacjan 5:22: *"Owocem zaś Ducha jest miłość, radość, pokój, cierpliwość..."*.

**3. Posłuszeństwo w małych rzeczach:**  
Bóg prowadzi krok po kroku. Uważność na delikatne podszepty Ducha to klucz do dojrzałego chrześcijaństwa.

### Podsumowanie
Proś codziennie, by Duch Boży Cię napełniał i dawał mądrość przed podejmowaniem jakiejkolwiek decyzji.

---
Zrób to Dla Jezusa - On już czeka. Otwórz swoje serce, wycisz się i słuchaj Bożych wskazówek.`,
      en: `### Introduction
Christianity is not about strictly following rules but submitting to the living, active presence of God – the Holy Spirit.

### Lesson: Life in the Spirit
**1. Teacher and Comforter:**  
Jesus left but promised: *"When the Spirit of truth comes, he will guide you into all the truth..."* (John 16:13). The Holy Spirit never leaves you.

**2. Discerning Voices:**  
The voice of the Holy Spirit brings God's peace and encourages love. As Galatians 5:22 teaches: *"But the fruit of the Spirit is love, joy, peace, patience..."*.

**3. Obedience in small things:**  
God leads step by step. Attentiveness to the gentle nudges of the Spirit is the key to mature Christianity.

### Summary
Ask daily for God's Spirit to fill you and give you wisdom before making any decision.

---
Do it for Jesus - He is already waiting. Open your heart, be still, and listen to God's guidance.`
    },

    'Nauka o Trójjedynym Bogu': {
      pl: `### Wprowadzenie
Wiara w Trójjedynego Boga to fundament chrześcijaństwa. Bóg Objawia się nam jako Ojciec, Syn i Duch Święty – jedna natura, w trzech doskonałych i współistniejących osobach.

### Lekcja: Tajemnica Trójcy
**1. Dowód Nowego Testamentu:**  
Podczas chrztu Jezusa (Mt 3:16-17) w jednym momencie widoczne są trzy Osoby: Syn wychodzący z wody, Duch Święty w postaci gołębicy i głos Ojca z nieba.

**2. Relacja ponad wszystko:**  
Bóg z samej Swojej natury (Jeden Bóg w Trzech Osobach) JEST Miłością, w wiecznej relacji, której my jesteśmy zaproszeni częścią.

**3. Znaczenie praktyczne:**  
Modlimy się DO Ojca, PRZEZ Syna (Jezusa Chrystusa), W mocy Ducha Świętego. 

### Podsumowanie
Nie musisz tego pojąć matematycznymi równaniami – Bóg przewyższa nasz umysł. Wymaga on serca, które ufa.

---
Zrób to Dla Jezusa - On już czeka. Uwielbij dzisiaj Boga w Jego pełnej, cudownej Trójcy.`,
      en: `### Introduction
Belief in the Triune God is the foundation of Christianity. God reveals Himself as Father, Son, and Holy Spirit – one essence, in three perfect, co-existing persons.

### Lesson: The mystery of the Trinity
**1. New Testament Proof:**  
At the baptism of Jesus (Mt 3:16-17), three Persons are seen simultaneously: the Son emerging from the water, the Holy Spirit descending like a dove, and the Father's voice from heaven.

**2. Relationship above all:**  
God by His very nature (One God in Three Persons) IS Love, living in eternal relationship, which we are invited to join.

**3. Practical meaning:**  
We pray TO the Father, THROUGH the Son (Jesus Christ), IN the power of the Holy Spirit.

### Summary
You don't have to comprehend this with mathematical equations – God transcends our minds. He requires a trusting heart.

---
Do it for Jesus - He is already waiting. Worship God today in His full, wonderful Trinity.`
    },

    'Kim jest Jezus Chrystus?': {
      pl: `### Wprowadzenie
W Ewangelii Mateusza (Mt 16:15) Jezus pyta: *"A wy za kogo mnie uważacie?"* To najważniejsze pytanie ludzkości, a od odpowiedzi na nie, zależy cała wieczność.

### Lekcja: Chrystologia
**1. Prawdziwy Bóg i prawdziwy człowiek:**  
Jezus to Wcielone Słowo Boga (J 1:1, 14). Stał się człowiekiem, narodził się, czuł głód, ból, ulegał zmęczeniu, a jednocześnie posiadał autorytet równy Ojcu by wybaczać grzechy.

**2. Skaza na krzyżu:**  
Aby zapłacić karę za nasze grzechy, potrzebna była bezgrzeszna ofiara. Tylko doskonały człowiek (i Bóg w jednej osobie) był w stanie odwrócić klątwę grzechu Adama (Rz 5:19).

**3. Nasz Najwyższy Kapłan:**  
W Liście do Hebrajczyków (Hbr 4:15) czytamy, że mamy kapłana, *"który może współczuć w naszych słabościach, kuszonego we wszystkim (...), z wyjątkiem grzechu"*. 

### Refleksja
Jezus wie jak Ci jest ciężko. On to wszystko przeszedł. 

---
Zrób to Dla Jezusa - On już czeka. Jemu możesz zaufać w 100 procentach. Oddaj Mu to z czym walczysz.`,
      en: `### Introduction
In Matthew's Gospel (Mt 16:15) Jesus asks: *"But who do you say that I am?"* This is the most important question of mankind, and eternity depends on the answer.

### Lesson: Christology
**1. True God and true man:**  
Jesus is the Incarnate Word of God (John 1:1, 14). He became man, was born, felt hunger, pain, yielded to fatigue, yet possessed authority equal to the Father to forgive sins.

**2. The blemish on the cross:**  
To pay the penalty for our sins, a sinless sacrifice was needed. Only a perfect man (and God in one person) was able to reverse the curse of Adam's sin (Rom 5:19).

**3. Our High Priest:**  
In Hebrews (Heb 4:15) we read that we have a priest, *"who is able to sympathize with our weaknesses, but one who in every respect has been tempted as we are, yet without sin."*

### Reflection
Jesus knows how hard it is for you. He has been through it all.

---
Do it for Jesus - He is already waiting. You can trust Him 100 percent. Surrender to Him what you are fighting.`
    },

    'Zbawienie przez Łaskę': {
      pl: `### Wprowadzenie
Jeśli sądzisz, że musisz zarobić na Niebo – nigdy Ci się nie uda. Na szczęście zbawienie to dar, a nie wypłata.

### Lekcja: Soteriologia
**1. Łaską jesteście zbawieni:**  
*"Albowiem łaską zbawieni jesteście przez wiarę, i to nie z was, Boży to dar;* (Ef 2:8). Nie możesz dodać nic do tego, co Jezus zrobił na krzyżu. 

**2. Martwi z powodu grzechu:**  
Grzech zniszczył ludzką naturę tak głęboko (Rz 3:23), że potrzebowaliśmy absolutnie Boskiej interwencji. 

**3. Dobre uczynki to OWOC a nie cena:**  
Czytamy dalej (Ef 2:10), że *"jesteśmy Jego dziełem, stworzeni w Chrystusie Jezusie do dobrych uczynków..."*. Robimy dobre rzeczy z wdzięczności i przemienionego serca, a nie w celu zdobycia zgody od Boga. 

### Podsumowanie
Darmowa woda życia jest dla Ciebie. Przyjdź do niej bez pieniędzy by pragnąć, lecz w uniżeniu i szczerym żalu.

---
Zrób to Dla Jezusa - On już czeka. Podziękuj dziś Chrystusowi za Jego krew, która okupiła Twoją wolność.`,
      en: `### Introduction
If you think you have to earn Heaven – you will never succeed. Fortunately, salvation is a gift, not a paycheck.

### Lesson: Soteriology
**1. Saved by grace:**  
*"For by grace you have been saved through faith. And this is not your own doing; it is the gift of God"* (Eph 2:8). You cannot add anything to what Jesus did on the cross.

**2. Dead due to sin:**  
Sin corrupted human nature so deeply (Rom 3:23) that we absolutely needed Divine intervention.

**3. Good works are the FRUIT, not the price:**  
We read further (Eph 2:10) that *"we are his workmanship, created in Christ Jesus for good works..."*. We do good things out of gratitude from a transformed heart, not to win God's approval.

### Summary
The free water of life is for you. Come to it without money to yearn, but in humility and genuine repentance.

---
Do it for Jesus - He is already waiting. Thank Christ today for His blood which bought your freedom.`
    },

    'Czasy Ostateczne': {
      pl: `### Wprowadzenie
Żyjemy w epoce, która zbliża się wielkimi krokami ku finalnym wydarzeniom w historii ziemi. Biblia jest przejrzystą księgą odsłaniającą ten bieg wydarzeń. 

### Lekcja: Eschatologia (Co nadejdzie)
**1. Znaki Czasu:**  
Jezus w Ewangelii Mateusza rozdział 24, zapowiada m.in. wojny, głód, trzęsienia ziemi, odstępstwo i ostygnięcie miłości wielu ludzi. Jednak to nie koniec to - znaki ostrzegawcze.

**2. Prawdziwa tożsamość:**  
Objawienie św. Jana przypomina nam byśmy trwali. *"Tu jest wytrwałość świętych, którzy przestrzegają przykazań Bożych i wiary w Jezusa."* (Obj 14:12). Odstępstwo jest łatwe, wierność kosztuje. 

**3. Zmartwychwstanie i Obietnica Życia:**  
Wkrótce powrót Zbawiciela: *"ponieważ sam Pan zstąpi z nieba... my (...), zostaniemy porwani na obłoki, w powietrze, na spotkanie Pana"* (1 Tes 4:16-17). Ten dzień dla wierzących to nie strach, ale tęsknota.

### Praktyka
Nie lękaj się przyszłości, jeśli wierzysz Jezusowi i opierasz na tym jak na opoque. 

---
Zrób to Dla Jezusa - On już czeka. Żyj tak, by w każdym momencie bez wstydu przywitać powracającego Króla!`,
      en: `### Introduction
We live in an age that is rapidly moving towards final events in Earth's history. The Bible is a transparent book revealing this course of events.

### Lesson: Eschatology (What is to come)
**1. Signs of the times:**  
Jesus, in Matthew chapter 24, foretells among other things wars, famines, earthquakes, apostasy, and the cooling of love in many people. Yet this is not the end - it is a warning sign.

**2. True identity:**  
The Revelation reminds us to endure. *"Here is a call for the endurance of the saints, those who keep the commandments of God and their faith in Jesus."* (Rev 14:12). Apostasy is easy, fidelity costs.

**3. Resurrection and Promise of Life:**  
Soon the Savior's return: *"For the Lord himself will descend from heaven... we (...) will be caught up together with them in the clouds to meet the Lord in the air"* (1 Thess 4:16-17). For believers, this day is not terror, but longing.

### Practice
Do not fear the future if you trust Jesus and stand on Him like a solid rock.

---
Do it for Jesus - He is already waiting. Live in a way that, at any moment, you can greet the returning King without shame!`
    },

    'Wielkie Posłannictwo': {
      pl: `### Wprowadzenie
Gdy Jezus opuszczał ziemię by zasiąść po prawicy Boga, zostawił nam bardzo konkretne zadanie. Czas działać.

### Lekcja: Misja całego Kościoła
**1. Rozkaz samego Mistrza:**  
*"Idźcie więc i nauczajcie wszystkie narody, chrzcząc je w imię Ojca i Syna, i Ducha Świętego;"* (Mt 28:19). Misją nie jest tylko chodzenie do zborów lub parafii w Sabat bądx Niedzielę, sam na sam.

**2. Każdy jest wezwany:**  
Zadanie to nie jest tylko dla wyświęconych przywódców, papieży czy pastorów. *"Wy zaś jesteście rodem wybranym, królewskim kapłaństwem."* (1 Piotra 2:9). 

**3. Na wzór Wojownika:**  
Słowo Boże idzie przez internet, Twoją rodzinę, pracę zawodową. Kiedy wykonujesz swoją pracę najlepiej jak potrafisz – to budzi zapytania! (Kol 3:23).

### Podsumowanie
Nie musisz ukończyć seminarium by powiedzieć sąsiadowi kim jest dla Ciebie Jezus. Twoje osobiste świadectwo jest kluczem.

---
Zrób to Dla Jezusa - On już czeka. Opowiedz o Nim komuś z Twojego środowiska. Dziś.`,
      en: `### Introduction
When Jesus left the earth to sit at the right hand of God, He left us a very specific task. It's time to act.

### Lesson: The mission of the entire Church
**1. The Master's command:**  
*"Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit;"* (Mt 28:19). The mission is not just going to church on Sabbath or Sunday, all by yourself.

**2. Everyone is called:**  
This task is not only for ordained leaders, popes, or pastors. *"But you are a chosen race, a royal priesthood."* (1 Pet 2:9).

**3. After the pattern of a Warrior:**  
The Word of God goes out via the internet, your family, your professional work. When you do your job the best you can – it raises questions! (Col 3:23).

### Summary
You do not need to graduate from the seminary to tell your neighbor who Jesus is to you. Your personal testimony is key.

---
Do it for Jesus - He is already waiting. Tell someone in your circle about Him. Today.`
    },
    
    'Skuteczne Świadectwo': {
      pl: `### Wprowadzenie
Ludzie rzadko dają się przekonać teologicznym i suchym monologom, wolą dowody, realną siłę, realne przemiany. Jesteś żywą ewangelią!

### Lekcja: Jak nieść światło w ciemnym świecie
**1. Autentyczność wygrywa:**  
Nie pokazuj że jesteś "idealnym" i świętoszkowatym wierzącym, na którego nie działają słabości (to rzadko jest prawda!). Paweł powiedział do Tytusa by dziać tak, by w *"każdej mierze stał się wzorem dla wierzących we wszystkim"*. 

**2. Świadectwo własnego błędu:**  
Świadectwo ma ogromną moc, jeśli powiesz: byłem zagubiony w hazardzie, w używkach, z pragnieniem grzechu a Jezus przemienił moje serce poprzez cierpienie.

**3. Używaj empatii, a unikaj osądu:**  
Sądź zachowanie, ale oddaj miłosierdzie nad człowiekiem. 

### Podsumowanie
Dobry Wojownik potrafi pomóc słabemu wejść na górę tam gdzie sam miał rany. Miejcie zawsze odpowiedź o wierze każdemu kto zapyta (1 Pt 3:15)!

---
Zrób to Dla Jezusa - On już czeka. Skróć dystans dla tych co pobłądzili!`,
      en: `### Introduction
People are rarely convinced by theological and dry monologues, they prefer proof, real strength, real transformation. You are a living gospel!

### Lesson: How to carry light in a dark world
**1. Authenticity wins:**  
Do not act like a "perfect" or pious believer on whom weaknesses make no impact (it's rarely true!). Paul told Titus to act in a way to become *"in every respect a model for believers in everything"*.

**2. Testimony of one's own failure:**  
Testimony has enormous power if you say: I was lost in gambling, in substances, with the desire for sin, and Jesus changed my heart through suffering.

**3. Use empathy and avoid judgment:**  
Judge the behavior, but have mercy for the person.

### Summary
A good Warrior knows how to help the weak climb up the mountain where he himself was wounded. Always have an answer about faith to everyone who asks (1 Pet 3:15)!

---
Do it for Jesus - He is already waiting. Bridge the gap for those who strayed!`
    }
  };

  // Some mapping from EN titles to PL titles since our structure uses PL titles as keys essentially, or we can handle direct matching.
  // Actually handle exact titles passed from `BiblicalSchoolPanel` where lessonTitle might be in EN or PL.
  if (!topicId) return null;
  const allEntries = Object.entries(lessons);
  const found = allEntries.find(([key, entry]) => key === topicId || entry.en.includes(topicId) || entry.pl.includes(topicId) || topicId.includes('Power of Prayer') || topicId.includes('Word of God') || topicId.includes('Triune God'));

  if (found) {
    return found[1][lang] || found[1].pl;
  }
  
  // Fallback map if needed based on common English names:
  if (topicId.includes('Power of Prayer')) return lessons['Moc Modlitwy'][lang];
  if (topicId.includes('Word of God')) return lessons['Życie Słowem Bożym'][lang];
  if (topicId.includes('Fasting')) return lessons['Dyscyplina Postu'][lang];
  if (topicId.includes('Holy Spirit')) return lessons['Prowadzenie Ducha Świętego'][lang];
  if (topicId.includes('Triune')) return lessons['Nauka o Trójjedynym Bogu'][lang];
  if (topicId.includes('Who is Jesus')) return lessons['Kim jest Jezus Chrystus?'][lang];
  if (topicId.includes('Grace')) return lessons['Zbawienie przez Łaskę'][lang];
  if (topicId.includes('End Times')) return lessons['Czasy Ostateczne'][lang];
  if (topicId.includes('Great Commission')) return lessons['Wielkie Posłannictwo'][lang];
  if (topicId.includes('Witnessing')) return lessons['Skuteczne Świadectwo'][lang];

  return null;
};
