// ==========================================
// User Functions
// ==========================================

const { getTransactionsByUser } = require("./transactionFunctions");
const users = require("../localData/users.json");


// ==========================================
// Get User
// ==========================================

function getUser(userId) {

  console.log("Executing getUser:", userId);

  const user = users.find(
    user => user.id === Number(userId)
  );

  if (!user) {

    return {
      success: false,
      message: `User ${userId} was not found.`
    };

  }

  return {
    success: true,
    user: user
  };

}


// ==========================================
// Search Users
// ==========================================

function searchUsers(query) {

  console.log("Executing searchUsers:", query);

  const searchTerm = String(query ?? "").trim().toLowerCase();
  const matchingUsers = searchTerm
    ? users.filter(user =>
        Object.values(user).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      )
    : [];

  return {
    success: true,
    users: matchingUsers
  };

}


// ==========================================
// Get User Transactions
// ==========================================

function getUserTransactions(userId) {

  console.log("Executing getUserTransactions:", userId);

  const user = users.find(
    user => user.id === Number(userId)
  );

  if (!user) {
    return {
      success: false,
      message: `User ${userId} was not found.`
    };
  }

  return getTransactionsByUser(userId);

}


// ==========================================
// Get User By Name
// ==========================================

function getUserByName(name) {

  console.log("Executing getUserByName:", name);

  const user = users.find(
    user => user.name.toLowerCase() === String(name ?? "").trim().toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      message: `User ${name} was not found.`
    };
  }

  return {
    success: true,
    user: user
  };

}


// ==========================================
// Export
// ==========================================

module.exports = {
  getUser,
  searchUsers,
  getUserTransactions,
  getUserByName
};