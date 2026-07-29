import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; //utiliser uniquement pour le typeage "type"

//la function proxy est une fuonction propore a next.js
//  elle doit ce nommer comme ce ceci elle récupera les
// requests avant que les pages ne soit rendu
export async function proxy(request: NextRequest) {
	return NextResponse.next();
	//récuperation du token qui s'apelle "token
	const token = request.cookies.get("token");

	if (!token) {
		//URL est un constructeur JavaScript natif
		// (pas spécifique à Next.js) qui construit
		// une URL absolue à partir d'un chemin relatif
		// (/login) et d'une URL de base (request.url,
		// qui contient l'URL complète de la requête actuelle
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const options = { headers: { Authorization: `Bearer ${token.value}` } };

	const response = await fetch("http://localhost:8000/api/user-info", options);

	if (response.ok) {
		//si token ok, on retourn la réponsse
		return NextResponse.next();
	} else {
		//sinon retour à login
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

//matcher exclus certain dossier pour la vérification sinon
// login bouclerait et on ne pourrait pas accéder au images
export const config = {
	matcher: ["/((?!login|_next/static|_next/image|favicon.ico|images).*)"],
};
