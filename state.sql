CREATE TABLE state (
    num int not null PRIMARY KEY,
    dlocation VARCHAR(10),
    user_id varchar(20) not null,
    roomno int NOT NULL,
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES account(id),
    FOREIGN KEY(num) REFERENCES machine(MACHINE_ID)
);