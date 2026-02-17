1) What is the difference between null and undefined? 
Ans: undefined মানে হলো একটি ভেরিয়েবল ডিক্লেয়ার করা হয়েছে কিন্তু এখনো কোনো মান অ্যাসাইন করা হয়নি। JavaScript নিজে থেকে এই মান দেয়।
null হলো একটি ইচ্ছাকৃত খালি মান। ডেভেলপার নিজে এটি সেট করেন বোঝাতে যে "এখানে ইচ্ছাকৃতভাবে কোনো মান নেই"।
let name;
console.log(name); // undefined

let user = null;
console.log(user); // null
2) What is the use of the map() function in JavaScript? How is it different from forEach()? 
Ans: map() একটি অ্যারের প্রতিটি উপাদানে একটি ফাংশন প্রয়োগ করে এবং একটি নতুন অ্যারে রিটার্ন করে — মূল অ্যারে পরিবর্তন না করেই।

const numbers = [1, 2, 3, 4];

// map() — নতুন অ্যারে রিটার্ন করে
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8]

// forEach() — কাজ করে কিন্তু কিছু রিটার্ন করে না
numbers.forEach(n => console.log(n * 2)); // 2, 4, 6, 8 প্রিন্ট হয়

const result = numbers.forEach(n => n * 2);
console.log(result); // undefined

3) What is the difference between == and ===? 
Ans: == (Loose Equality): তুলনা করার আগে উভয় মানকে একই টাইপে রূপান্তর করে (type coercion), তারপর মান তুলনা করে।
=== (Strict Equality): মান এবং টাইপ — উভয়ই তুলনা করে — কোনো টাইপ কনভার্শন হয় না।

console.log(5 == "5");   // true  — "5" কে number 5-এ কনভার্ট করে
console.log(5 === "5");  // false — number বনাম string, টাইপ আলাদা

console.log(0 == false);   // true  — false কে 0-তে কনভার্ট করে
console.log(0 === false);  // false — number বনাম boolean

console.log(null == undefined);   // true
console.log(null === undefined);  // false

console.log("" == false);   // true
console.log("" === false);  // false

4) What is the significance of async/await in fetching API data? 
Ans: JavaScript একটি single-threaded ভাষা, অর্থাৎ এটি একসাথে একটি কাজই করতে পারে। API থেকে ডেটা আনতে সময় লাগে। অ্যাসিঙ্ক্রোনাস হ্যান্ডলিং ছাড়া ব্রাউজার রেসপন্সের জন্য অপেক্ষা করতে গিয়ে জমে যাবে। async/await এই সমস্যার সুন্দর সমাধান দেয়।

কেন গুরুত্বপূর্ণ:

- কোড উপর থেকে নিচে পড়া যায় — synchronous কোডের মতো সহজ
- try/catch দিয়ে error হ্যান্ডলিং পরিষ্কার এবং পরিচিত
- একাধিক API call পরপর করা সহজ
- গভীরভাবে নেস্টেড "callback hell" এড়ানো যায়

async কীওয়ার্ড একটি ফাংশনকে সবসময় Promise রিটার্ন করায়। await কীওয়ার্ড সেই ফাংশনের ভেতরে Promise সম্পন্ন হওয়া পর্যন্ত থামিয়ে রাখে — কিন্তু বাকি JavaScript রানটাইম চলতে থাকে, তাই পেজ জমে যায় না।

5) Explain the concept of Scope in JavaScript (Global, Function, Block).
Ans: Scope নির্ধারণ করে কোডের কোথায় কোথায় একটি ভেরিয়েবল অ্যাক্সেস করা যাবে। JavaScript-এ তিনটি স্তরের Scope আছে।

Global Scope:
যেকোনো ফাংশন বা ব্লকের বাইরে ডিক্লেয়ার করা ভেরিয়েবল globally scoped — কোডের যেকোনো জায়গা থেকে অ্যাক্সেস করা যায়।

const siteName = "SwiftCart"; // Global scope

function showName() {
  console.log(siteName); // এখানে অ্যাক্সেস করা যাচ্ছে
}

showName();
console.log(siteName); // এখানেও অ্যাক্সেস করা যাচ্ছে


Function Scope:
ফাংশনের ভেতরে ডিক্লেয়ার করা ভেরিয়েবল শুধুমাত্র সেই ফাংশনের ভেতরেই অ্যাক্সেস করা যায়। বাইরে থেকে পৌঁছানো যায় না।
javascriptfunction calculateTotal() {
  var total = 150; // Function scope
  console.log(total); // 150
}

calculateTotal();
console.log(total); // ReferenceError — বাইরে অ্যাক্সেস করা যাচ্ছে না

Block Scope: 
let বা const দিয়ে {} ব্লকের ভেতরে (যেমন if বা for লুপ) ডিক্লেয়ার করা ভেরিয়েবল শুধুমাত্র সেই ব্লকের ভেতরেই অ্যাক্সেস করা যায়। লক্ষ্য করুন: var block scope মানে না।

javascriptif (true) {
  let discount = 20;         // Block scope 
  const tax = 5;             // Block scope 
  var oldVar = "বাইরে যাই"; // var ব্লক স্কোপ উপেক্ষা করে 
}

console.log(oldVar);   // "বাইরে যাই" — var ব্লক থেকে বেরিয়ে যায়
console.log(discount); // ReferenceError
console.log(tax);      // ReferenceError