(function() {

	var API_LAST_KEY = "a8da4176b3e227778d267fdc4df7ab36";
	var API_LAST_URL = "http://ws.audioscrobbler.com/2.0/?";

	var timeout;

	var artist = {
		image: null,
		name: "",
		bio: "",
		similar: []
	};	

	var $nameArtist = $("[data-name-artist]");
	$($nameArtist).on("keyup", searchSimilarArtist);

	$("[data-similar-artists]").on("click", "#similar-artist", mostrarProfileArtist);

	function renderizarSimilarArtist(event) {
		event.preventDefault();
		artist.name = event.currentTarget.innerText;
		renderizarSimilarProfile();
		function renderizarSimilarProfile() {
			$.getJSON(API_LAST_URL + "method=artist.getinfo" + "&artist=" + artist.name + "&api_key=" + API_LAST_KEY + "&format=json" + "&limit=15", renderSimilarArtist);

			function renderSimilarArtist(response) {
				artist.image = new Image();
				artist.image.src = response.artist.image[response.artist.image.length -1]["#text"];
				artist.bio = response.artist.bio.summary;
				//for(var i = 0, len = 5; i < 5; i++ ){
					debugger
					artist.similar.push(response.artist.similar.artist[4]["name"]);
				//}

				var elemento = $("#artist-template").html();
				var template = Handlebars.compile(elemento);
				var html = template(artist);
				$("#profile-artist").html(html);
				$("#img-artist").append(artist.image);
				var $similarArtist = $("[data-similar-artist]");
				$($similarArtist).on("click", renderizarSimilarArtist);
			}
		}
	}

	function mostrarProfileArtist(event) {
		$("[data-similar-artists]").hide();
		$("#form").hide();
		event.preventDefault();
		artist.name = event.currentTarget.innerText;
		renderizarProfile();
		function renderizarProfile() {
			$.getJSON(API_LAST_URL + "method=artist.getinfo" + "&artist=" + artist.name + "&api_key=" + API_LAST_KEY + "&format=json" + "&limit=5", renderArtist);

			function renderArtist(response) {
				artist.image = new Image();
				artist.image.src = response.artist.image[response.artist.image.length -1]["#text"];
				artist.bio = response.artist.bio.summary;
				//for(var i = 0, len = 5; i < 5; i++ ){
					artist.similar.push(response.artist.similar.artist[0]["name"]);
				//}

				var elemento = $("#artist-template").html();
				var template = Handlebars.compile(elemento);
				var html = template(artist);
				$("#profile-artist").html(html);
				$("#img-artist").append(artist.image);
				var $similarArtist = $("[data-similar-artist]");
				$($similarArtist).on("click", renderizarSimilarArtist);
			}
		}
	}

	function searchSimilarArtist(event) {
		if ($($nameArtist).val() !== "" ) {
			timeout = window.setTimeout(function () {
			$.getJSON(API_LAST_URL + "method=artist.getsimilar" + "&artist=" + $nameArtist.val() + "&api_key=" + API_LAST_KEY + "&format=json" + "&limit=15", fillSimilarArtist);
			}, 600);
		}
	}

	function clearTimeout(timeout) {
		window.clearTimeout(timeout);
	}

	function fillSimilarArtist(data) {
		if(data.similarartists.artist instanceof Object){
			var sizeSimilarArtist = data.similarartists.artist.length;
		}
		var similarArtists = document.querySelector("[data-similar-artists]");
		$(similarArtists).empty();

		for (var i = 0; i < sizeSimilarArtist; i++) {
			console.log(data);

			var aleatorio = document.querySelector("#aleatorio");
			var similarArtist = document.createElement("div");
			var nameArtistP = document.createElement("p");
			var imgArtist = document.createElement("img");

			similarArtist.classList.add("container--artist");
			similarArtist.id = "similar-artist";
			nameArtistP.classList.add("name--artist");
			imgArtist.classList.add("container--artist__image");

			nameArtistP.innerHTML = data.similarartists.artist[i].name;
			console.log(data.similarartists.artist[i].image[1]);
			imgArtist.src = data.similarartists.artist[i].image[1]["#text"];

			
			similarArtist.appendChild(nameArtistP);
			similarArtist.appendChild(imgArtist);
			similarArtists.appendChild(similarArtist);
		}
	}

})();