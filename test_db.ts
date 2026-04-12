import dbConnect from "./lib/mongodb";
async function test() {
  try {
    await dbConnect();
    console.log("Connected successfully!");
  } catch(e) {
    console.log("Error:", e);
  }
}
test();
