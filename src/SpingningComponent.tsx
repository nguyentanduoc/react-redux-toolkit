import { selectRequestId } from "./slice/spinningSlide"
import { useAppSelector } from "./store"

const SpingningComponent = () => {
  const requestIds = useAppSelector(selectRequestId)
  if(requestIds.length > 0) {
    return <div>Loading....</div>
  }
  return (
    <></>
  )
}

export default SpingningComponent