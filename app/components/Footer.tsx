import { Disclosure } from "@headlessui/react"

function Footer() {
  return (
    <Disclosure as="nav" className="bg-gray-800 text-white text-center py-5">
  <p>&copy; 2025 Your Company</p>
  <p>Contact: info@yourcompany.com</p>
</Disclosure>
  )
}

export default Footer