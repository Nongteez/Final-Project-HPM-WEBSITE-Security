
import Navbar from "../components/Navbar"

export default function Layout({ children }) {
    return (
      <>
        <Navbar />
        <main  className="max-w-7xl mx-auto pt-10 px-6  flex flex-col items-center p-4">
        {children}

        </main>
        
      </>
    )
  }