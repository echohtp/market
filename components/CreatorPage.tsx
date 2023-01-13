import Link from "next/link"
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import EditionCard from "@/components/EditionCard"


interface CreatorPageProps {
    creator: any
}

const CreatorPage = ({creator}: CreatorPageProps) => {
    console.log("creator page:", creator)
    return (
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {creator != null && creator.editions.map((edition: any) => (
        <EditionCard edition={edition} creator={creator} />
      ))}
    </ul>
    )
}

export default CreatorPage