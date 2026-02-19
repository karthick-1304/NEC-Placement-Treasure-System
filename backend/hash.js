import bcrypt from 'bcrypt';

async function generateHash(password) {
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

(async () => {
    const password = "pass@123";
    const hashedPassword = await generateHash(password);
    console.log("Hashed password:", hashedPassword);
})();