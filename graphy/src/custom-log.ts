export async function Log(msg: string): Promise<void> {
  console.log(msg)
  fetch("http://localhost:7777/log", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({ msg })
  })
    .then((response) => response.text())
    .then(console.log)
    .catch(console.error)
}
