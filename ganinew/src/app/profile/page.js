import Link from 'next/link'

export default function profile(){
    return (
    <div>
        This is profile page
        <Link href="/profile/editprofile">editprofile</Link>
    </div>
    
    )
}