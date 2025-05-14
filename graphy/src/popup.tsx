import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")
  const [filter, setFilter] = useState("")
  return (
    <input type="text" value={filter} onChange={v => {setFilter(v.target.value)}}/>
    // display the graph
  )
}

export default IndexPopup
