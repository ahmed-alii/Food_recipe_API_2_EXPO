import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, RefreshControl, ScrollView, StyleSheet, View} from 'react-native'
import {Text, theme} from 'galio-framework';
import UserContext from "../connection/userContext";
import RecipeListItem from "../components/RecipeListItem";
import {Firebase} from "../connection/comms";

const {width, height} = Dimensions.get('screen');


export default function Favourites({navigation}) {
  const [Loading, setLoading] = useState(true)
  const [FoodData, setFoodData] = useState(undefined)
  const [refreshing, setRefreshing] = useState(false);
  const {loggedIn, setLoggedin} = useContext(UserContext)

  const loadDataInView = () => {
    Firebase.getFavRecipes(loggedIn.uid).then(res => {
      if (res.error) {
        alert(res.error)
        setLoading(false)
        setRefreshing(false)
      } else {
        setFoodData(res)
        setLoading(false)
        setRefreshing(false)
      }
    })

  }

  useEffect(() => {
    if (Loading === true) {
      loadDataInView()
    }
  })

  const onRefresh = () => {
    loadDataInView()
    setRefreshing(true)
    setLoading(true)

  }


  return (
      <UserContext.Consumer>
        {({loggedIn, setLoggedin}) => (
            <View style={styles.container}>
              <Text h4 style={{marginBottom: theme.SIZES.BASE / 2, fontWeight: "bold"}}>Favourite Recipes 💕</Text>

              <ScrollView style={styles.container}
                          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

                {!FoodData && <Text style={{
                  fontSize: 40,
                  fontWeight: "bold",
                  color: "rgba(0,0,0,0.13)",
                  textAlign: "center",
                  paddingTop: height / 3
                }}>Explore recipes and select your favourites 🍕</Text>}
                {FoodData && FoodData.map((food, key) => (
                    <RecipeListItem recipe={food} navigation={navigation} horizontal key={key}/>
                ))}

              </ScrollView>
            </View>
        )}
      </UserContext.Consumer>


  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 10,
  },
  header: {
    padding: 20,
  },
  smallText: {
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "200",
    color: "grey"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold"
  }
});
