//import data
import movieData from "./movieData";

function scale_score(movie) {
    return movie.revenue/movie.budget;
}

function buildHierarchy() {
    let mapped = new Map();

    movieData.forEach((movie) => {
        movie.genres.forEach((genre) => {
            if (!mapped.has(genre)) {
                mapped.set(genre, []);
            }
            mapped.get(genre).push({
                category: genre,
                name: movie.title,
                value: scale_score(movie),
            });
        })
    });

    const allChildren = Array.from(mapped, ([key, value]) => {
        return {
            name: key,
            children: value,
        };
    });
    
    return {
        name: 'Movies by Genre',
        children: allChildren,
    };

}
let movieTree = buildHierarchy();

export default movieTree;