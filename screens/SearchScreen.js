import React, {useState} from "react";
import {Dimensions, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
import {SearchBar} from "react-native-elements";
import {Fetch} from "../connection/comms";
import UserContext from "../connection/userContext";
import RecipeListItem from "../components/RecipeListItem";
const {width, height} = Dimensions.get('screen');


export default function SearchScreen({navigation}) {
    const [search, setSearch] = useState("");
    const [Loading, setLoading] = useState(true)
    const [results, setResults] = useState(undefined)
    const [refreshing, setRefreshing] = useState(false);

    let updateSearch = search => {
        setSearch(search);
    }

    const loadDataInView = () => {
        if (search !== "") {
            Fetch.searchRecipe(search).then(r => setResults(r))
            console.log(results)
            setLoading(false)
            setRefreshing(false)
        }
    }


    const onRefresh = () => {
        loadDataInView()
        setRefreshing(true)
        setLoading(true)

    }

    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <SafeAreaView style={styles.container}>
                    <SearchBar
                        platform="ios"
                        cancelButtonTitle="Cancel"
                        placeholder='Search recipes'
                        value={search}
                        onChangeText={updateSearch}
                        onSubmitEditing={loadDataInView}
                        containerStyle={{paddingVertical: 50, backgroundColor: "#fff"}}
                    />
                    <ScrollView style={styles.container}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                    >
                        {!results && <Text style={{fontSize: 40, fontWeight: "bold", color: "rgba(0,0,0,0.13)", textAlign: "center", paddingTop: height/3}}>Find Something To Cook Today 🍽</Text>}
                        {results && results.results.map((item, key) => (

                            <RecipeListItem recipe={item}
                                            navigation={navigation}
                                            horizontal key={key}
                                            buildImageWith={"https://spoonacular.com/recipeImages/"}
                                            getInfoByID
                            />
                        ))}
                    </ScrollView>
                </SafeAreaView>
            )}
        </UserContext.Consumer>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchHeader: {}
});
