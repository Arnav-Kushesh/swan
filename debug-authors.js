
const { getAuthors } = require('./lib/data');

try {
    console.log("Attempting to get authors...");
    const authors = getAuthors();
    console.log("Authors:", authors);
} catch (error) {
    console.error("Error getting authors:", error);
}
