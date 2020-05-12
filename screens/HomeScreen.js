import React, {useContext, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native'
import { Button, Block, Text, Input, theme } from 'galio-framework';

import UserContext from "../connection/userContext";
import dataList from "../assets/response";
import RecipeListItem from "../components/RecipeListItem";
import {Fetch, Firebase} from "../connection/comms";


export default function HomeScreen({navigation}) {
  const [Loading, setLoading] = useState(true)
  const [FoodData, setFoodData] = useState(undefined)
  const [refreshing, setRefreshing] = useState(false);
  const {loggedIn, setLoggedin} = useContext(UserContext)


  const loadDataInView = () => {

    Fetch.getRandom().then(res => {
      if(res.error){
        alert(res.error)
        setLoading(false)
        setRefreshing(false)
      }else{
        setFoodData(res.recipes)
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
              <Text h4 style={{marginBottom: theme.SIZES.BASE / 2, fontWeight: "bold"}}>Explore Recipes 🍱</Text>

              <ScrollView style={styles.container}
                          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

                {!FoodData && <Text style={{textAlign: "center"}}>{"Loading Recipes..."}</Text>}
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
