import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import Form from "next/form";
import {update} from "@/app/users/actions";

export default async function OnBoarding() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user || session.user.onBoarded) {
        redirect("/")
    }

    return (
        <div>
            <p>On boarding page</p>
            <div>
                Email : {session.user.email}
                <Form action={update}>
                    <input name="id" type="hidden" value={session.user.id}/>
                    <input name="firstname" type="text"/>
                    <input name="lastname" type="text"/>
                    <input name="onBoarded" type="hidden" value="false"/>
                    <select name="role">
                        <option value="ARTIST">Artiste</option>
                        <option value="USER">Utilisateur</option>
                    </select>
                    <input name="image" type="file"/>
                    <input type="submit" value="Envoyer"/>
                </Form>
            </div>
        </div>
    )
}