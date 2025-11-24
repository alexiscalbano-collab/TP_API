-- Drop tables if they exist (with CASCADE to remove dependencies)
DROP TABLE IF EXISTS Bibliotheque_Jeux CASCADE;
DROP TABLE IF EXISTS Achats CASCADE;
DROP TABLE IF EXISTS Jeux CASCADE;
DROP TABLE IF EXISTS Utilisateurs CASCADE;

 

-- Create Utilisateurs table

CREATE TABLE Utilisateurs (
    Utilisateur_ID SERIAL PRIMARY KEY,
    Nom_Utilisateur TEXT NOT NULL UNIQUE,
    Email TEXT NOT NULL UNIQUE,
    Date_Inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 

-- Create Jeux table

CREATE TABLE Jeux (

    Jeu_ID SERIAL PRIMARY KEY,
    Titre TEXT NOT NULL,
    Developpeur TEXT NOT NULL,
    Editeur TEXT NOT NULL,
    Date_Sortie DATE,
    Image TEXT NOT NULL,
    Prix NUMERIC(10, 2) NOT NULL

);

 

-- Create Achats table

CREATE TABLE Achats (
    Achat_ID SERIAL PRIMARY KEY,
    Utilisateur_ID INTEGER NOT NULL REFERENCES Utilisateurs(Utilisateur_ID) ON DELETE CASCADE,
    Jeu_ID INTEGER NOT NULL REFERENCES Jeux(Jeu_ID) ON DELETE CASCADE,
    Date_Achat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 

-- Create BibliothequeJeux table

CREATE TABLE Bibliotheque_Jeux (

    Bibliotheque_ID SERIAL PRIMARY KEY,
    Utilisateur_ID INTEGER NOT NULL REFERENCES Utilisateurs(Utilisateur_ID) ON DELETE CASCADE,
    Jeu_ID INTEGER NOT NULL REFERENCES Jeux(Jeu_ID) ON DELETE CASCADE,
    Heures_Jeu INTEGER DEFAULT 0,
    Est_Installe BOOLEAN DEFAULT FALSE,
    UNIQUE (Utilisateur_ID, Jeu_ID)

);

 

-- Insert data into Utilisateurs table

INSERT INTO Utilisateurs (Nom_Utilisateur, Email, Date_Inscription) VALUES
('Alice', 'alice@example.com', '2003-09-15 10:30:00'),
('Bob', 'bob@example.com', '2010-06-20 14:45:00'),
('Charlie', 'charlie@example.com', '2015-03-10 09:15:00'),
('Diana', 'diana@example.com', '2018-11-25 16:00:00'),
('Eve', 'eve@example.com', '2022-07-05 12:00:00');

 

-- Insert data into Jeux table

INSERT INTO Jeux (Titre, Developpeur, Editeur, Date_Sortie, Prix, Image) VALUES
('The Legend of Zelda: Breath of the Wild', 'Nintendo', 'Nintendo', '2017-03-03', 59.99, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/118601-1.jpg'),
('Cyberpunk 2077', 'CD Projekt Red', 'CD Projekt', '2020-12-10', 49.99, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/14517-1.jpg'),
('Minecraft', 'Mojang Studios', 'Mojang Studios', '2011-11-18', 26.95, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/50424-1.jpg'),
('The Witcher 3: Wild Hunt', 'CD Projekt Red', 'CD Projekt', '2015-05-19', 39.99, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/33255-1.jpg'),
('Stardew Valley', 'ConcernedApe', 'ConcernedApe', '2016-02-26', 14.99, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/35320-1.png'),
('Elden Ring', 'FromSoftware', 'Bandai Namco', '2022-02-25', 59.99, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/65101-1.jpg'),
('Hollow Knight', 'Team Cherry', 'Team Cherry', '2017-02-24', 14.99, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/43548-1.jpg'),
('Red Dead Redemption 2', 'Rockstar Games', 'Rockstar Games', '2018-10-26', 59.99, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/66595-1.jpg'),
('Among Us', 'Innersloth', 'Innersloth', '2018-11-16', 4.99, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/77267-1.jpg'),
('Celeste', 'Maddy Makes Games', 'Maddy Makes Games', '2018-01-25', 19.99, 'https://cdn.thegamesdb.net/images/thumb/boxart/front/53935-1.jpg');

 

-- Insert data into Achats table

INSERT INTO Achats (Utilisateur_ID, Jeu_ID, Date_Achat) VALUES
(1, 1, '2017-03-10 12:00:00'),
(1, 3, '2012-01-15 14:00:00'),
(2, 2, '2021-01-05 10:30:00'),
(2, 4, '2016-06-01 09:00:00'),
(3, 5, '2016-03-01 11:45:00'),
(3, 6, '2022-03-01 15:30:00'),
(4, 7, '2018-12-01 13:00:00'),
(4, 8, '2019-01-10 16:20:00'),
(5, 9, '2022-08-01 10:00:00'),
(5, 10, '2022-08-15 14:30:00');

 

-- Insert data into BibliothequeJeux table

INSERT INTO Bibliotheque_Jeux (Utilisateur_ID, Jeu_ID, Heures_Jeu, Est_Installe) VALUES
(1, 1, 20, TRUE),
(1, 3, 50, TRUE),
(2, 2, 15, FALSE),
(2, 4, 30, TRUE),
(3, 5, 40, TRUE),
(3, 6, 10, FALSE),
(4, 7, 25, TRUE),
(4, 8, 35, TRUE),
(5, 9, 5, FALSE),
(5, 10, 12, TRUE);
