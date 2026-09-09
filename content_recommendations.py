import sys
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from fuzzywuzzy import fuzz
import json

def get_content_recommendations(attraction_name):
    # Load the attractions dataset into a Pandas DataFrame
    attractions = pd.read_csv('Bamyan_attraction.csv')

    # Concatenate 'name', 'description', and 'category' into a single text column
    attractions['combined_text'] = attractions['name'] + ' ' + attractions['description'] + ' ' + attractions['category']

    # TF-IDF Vectorization
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(attractions['combined_text'])

    # Calculate cosine similarity for content-based recommendations
    cosine_similarities_content = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Perform a fuzzy search on the combined_text
    matches = attractions['combined_text'].apply(lambda x: fuzz.partial_ratio(attraction_name, x))

    # Find the best match
    best_match_idx = matches.idxmax()
    best_match_score = matches.loc[best_match_idx]

    # Threshold for considering a match (you can adjust this based on your needs)
    threshold = 80

    if best_match_score >= threshold:
        idx = best_match_idx
        sim_scores = list(enumerate(cosine_similarities_content[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:6]  # Get the top 5 similar attractions
        recommendations = attractions.loc[[i[0] for i in sim_scores], ['loc_id', 'name', 'category']].to_dict(orient='records')
        return recommendations
    else:
        print(f"No close match found for '{attraction_name}'. Showing general recommendations.")
        sim_scores = cosine_similarities_content.sum(axis=0) / len(attractions)
        sim_scores = list(enumerate(sim_scores))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[:5]  # Get the top 5 general recommendations
        recommendations = attractions.loc[[i[0] for i in sim_scores], ['loc_id', 'name', 'category']].to_dict(orient='records')
        return recommendations

if __name__ == "__main__":
    # Get the attraction name from command-line arguments
    attraction_name = sys.argv[1]

    # Get content-based recommendations based on the attraction name
    content_based_recommendations = get_content_recommendations(attraction_name)
    
    # Output recommendations as JSON
    print(json.dumps(content_based_recommendations))
