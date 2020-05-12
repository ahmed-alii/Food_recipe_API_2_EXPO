import React, {useState} from 'react';
import {Dimensions, Image, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Block, Text, theme} from 'galio-framework';
import Spinner from 'react-native-loading-spinner-overlay';
import {Fetch} from "../connection/comms";

const {width} = Dimensions.get('screen');

export default function RecipeListItem({navigation, recipe, horizontal, full, style, priceColor, getInfoByID, imageStyle, buildImageWith}) {
    const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];
    const [spinning, setSpinning] = useState(false)

    return (
        <Block row={horizontal} card flex style={[styles.recipe, styles.shadow, style]}>
            <Spinner
                visible={spinning}
                textContent={'Getting Recipe \n' + recipe.title}
                textStyle={styles.spinnerTextStyle}
            />
            <TouchableWithoutFeedback onPress={() => {
                if (getInfoByID) {
                    setSpinning(true)
                    Fetch.getInfoByID(recipe.id).then(r => {
                        setSpinning(false)
                        navigation.navigate('Details', {recipe: r})
                    })
                } else {
                    navigation.navigate('Details', {recipe: recipe})
                }

            }}>
                <Block flex style={[styles.imageContainer, styles.shadow]}>
                    {buildImageWith && <Image source={{uri: buildImageWith + recipe.image}} style={imageStyles}/>}
                    {!buildImageWith && <Image source={{uri: recipe.image}} style={imageStyles}/>}
                </Block>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => {
                if (getInfoByID) {
                    setSpinning(true)
                    Fetch.getInfoByID(recipe.id).then(r => {
                        setSpinning(false)
                        navigation.navigate('Details', {recipe: r})
                    })
                } else {
                    navigation.navigate('Details', {recipe: recipe})
                }

            }}>
                <Block flex space="between" style={styles.productDescription}>
                    <Text size={14} style={styles.productTitle}>{recipe.title}</Text>
                    <Text size={12} muted={!priceColor} color={priceColor}>🕑 Prep. Time: {recipe.readyInMinutes}</Text>
                    <Text size={12} muted={!priceColor} color={priceColor}>🍛 Servings: {recipe.servings}</Text>
                </Block>
            </TouchableWithoutFeedback>
        </Block>
    );
}

const styles = StyleSheet.create({
    recipe: {
        backgroundColor: theme.COLORS.WHITE,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
    },
    productTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingBottom: 6,
    },
    productDescription: {
        padding: theme.SIZES.BASE / 2,
    },
    imageContainer: {
        elevation: 1,
    },
    image: {
        borderRadius: 3,
        marginHorizontal: theme.SIZES.BASE / 2,
        marginTop: -16,
    },
    horizontalImage: {
        height: 122,
        width: 'auto',
    },
    fullImage: {
        height: 215,
        width: width - theme.SIZES.BASE * 3,
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
    },
});