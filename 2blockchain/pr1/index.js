function User(firstName, lastName, age, gender) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  this.gender = gender;
}

const user1 = new User("Bob", "Dilan", 29, "male");
const user2 = new User("Jill", "Robinson", 29, "female");

console.log("user1", user1);
console.log("user2", user2);

User.prototype.emailDomain = "@facebooc.com";
User.prototype.getUaerEmail = function () {
  return this.firstName + this.lastName + this.emailDomain;
};
