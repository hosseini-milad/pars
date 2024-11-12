const names = ["آریا", "محد", "علی", "اعلام", "آآآببب", "مهناز"];

// Sort the names using localeCompare with Persian locale
names.sort((a, b) => a.localeCompare(b, 'fa-IR'));

console.log(names);