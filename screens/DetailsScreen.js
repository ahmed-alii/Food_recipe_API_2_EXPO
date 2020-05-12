import React, {useContext, useState} from 'react';
import {
    Dimensions,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Alert
} from 'react-native';
import {Block, Card, Text, theme} from 'galio-framework';
import UserContext from "../connection/userContext";
import Icon from "../components/Icon"
import {LinearGradient} from 'expo-linear-gradient';
import {HeaderHeight} from "../constants/utils";
import materialTheme from "../constants/materialTheme";
import {ListItem} from "react-native-elements";
import {Firebase} from "../connection/comms";

const {width, height} = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

export default function DetailsScreen({navigation, route}) {
    const {loggedIn, setLoggedin} = useContext(UserContext)
    const [isShow, setShow] = useState(false);

    const details = route.params.recipe
    navigation.setOptions({headerTitle: details.title});

    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <Block flex style={styles.profile}>
                    <Block flex>
                        <ImageBackground
                            source={{uri: details.image}}
                            style={styles.profileContainer}
                            imageStyle={styles.profileImage}>
                            <Block flex style={styles.profileDetails}>
                                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={styles.gradient}/>
                            </Block>
                        </ImageBackground>
                    </Block>
                    <Block flex style={styles.options}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Block style={styles.profileTexts}>
                                <Text color="black" size={28} style={{paddingBottom: 8}}>{details.title}</Text>

                                <TouchableWithoutFeedback
                                    onPress={() => Firebase.addToFav(loggedIn.uid, details).then(r => {
                                        if (r === true) {
                                            Alert.alert("👨🏻‍🍳 Added to Favourites.", "\n"+details.title)
                                        } else {
                                            Alert.alert("👨🏻‍🍳 Error.")
                                        }
                                    })}>

                                    <Text size={16} color={materialTheme.COLORS.WARNING}>
                                        <Icon name="shape-star" family="GalioExtra" size={16}/> Add Favourite
                                    </Text>
                                </TouchableWithoutFeedback>
                            </Block>
                            <Block row space="between" style={{padding: theme.SIZES.BASE,}}>
                                <Block middle>
                                    <Text bold size={12} style={{marginBottom: 8}}>{details.readyInMinutes} Min</Text>
                                    <Text muted size={12}>Ready in</Text>
                                </Block>
                                <Block middle>
                                    <Text bold size={12} style={{marginBottom: 8}}>{details.servings}</Text>
                                    <Text muted size={12}>Servings</Text>
                                </Block>
                                <Block middle>
                                    <Text bold size={12} style={{marginBottom: 8}}>{details.spoonacularScore}</Text>
                                    <Text muted size={12}>Score</Text>
                                </Block>
                            </Block>
                            <Block row space="between" style={{marginVertical: 40}}>
                                <Text h4 bold>🛒 Ingredients</Text>
                            </Block>
                            <Block>
                                {details.extendedIngredients.map((item, key) => (
                                    <ListItem
                                        key={key}
                                        leftAvatar={{source: {uri: "https://spoonacular.com/cdn/ingredients_100x100/" + item.image}}}
                                        title={item.originalString}
                                        bottomDivider
                                    />
                                ))}
                            </Block>
                            <View>
                                <Block row space="between" style={{marginTop: 40}}>
                                    <Text h4 bold>🗒 Steps</Text>
                                </Block>

                                {details.analyzedInstructions.map((step, key) => (
                                    <Card key={key}
                                          style={{marginTop: 0}}
                                          title={step.name}
                                          borderless
                                    >
                                        {step.steps.map((item, key) => (
                                            <View>
                                                <ListItem
                                                    title={<Text h5 bold color={"orange"}>{item.number}</Text>}
                                                    subtitle={item.step}
                                                />
                                            </View>
                                        ))}
                                    </Card>
                                ))}
                            </View>
                            <View style={{height: height / 2}}/>
                        </ScrollView>
                    </Block>
                </Block>
            )}
        </UserContext.Consumer>


    );
}


const styles = StyleSheet.create({
    profile: {
        marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
        marginBottom: -HeaderHeight * 2,
    },
    profileImage: {
        width: width * 1.1,
        height: 'auto',
    },
    profileContainer: {
        width: width,
        height: height / 3,
    },
    profileDetails: {
        paddingTop: theme.SIZES.BASE * 3,
        justifyContent: 'flex-end',
        position: 'relative',
    },
    profileTexts: {
        paddingHorizontal: theme.SIZES.BASE,
        zIndex: 2
    },
    pro: {
        backgroundColor: materialTheme.COLORS.LABEL,
        paddingHorizontal: 6,
        marginRight: theme.SIZES.BASE / 2,
        borderRadius: 4,
        height: 19,
        width: 38,
    },
    seller: {
        marginRight: theme.SIZES.BASE / 2,
    },
    options: {
        position: 'relative',
        padding: theme.SIZES.BASE,
        marginTop: -theme.SIZES.BASE * 30,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 8,
        shadowOpacity: 0.2,
        zIndex: 2,
    },
    thumb: {
        borderRadius: 4,
        marginVertical: 4,
        alignSelf: 'center',
        width: thumbMeasure,
        height: thumbMeasure
    },
    gradient: {
        zIndex: 1,
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
        position: 'absolute',
    },
});
