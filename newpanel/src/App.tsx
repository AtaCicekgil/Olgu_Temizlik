import { ModeController } from './modes/ModeController'
import { ToastContainer } from './components/ui/Toast'

export default function App() {
  return (
    <>
      <div className="h-full w-full overflow-hidden">
        <ModeController />
      </div>
      <ToastContainer />
    </>
  )
}
