import React from 'react';
import {Dimensions, ImageBackground, Platform, ScrollView, StyleSheet, Share} from 'react-native';
import {Block, Button, Text, theme} from 'galio-framework';
import {LinearGradient} from 'expo-linear-gradient';
import materialTheme from '../constants/materialTheme';
import {HeaderHeight} from "../constants/utils";
import UserContext from "../connection/userContext";
import {deleteUserData} from "../connection/AsyncStorage";
import {Firebase} from "../connection/comms";

const {width, height} = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

export default function Profile() {

    const shareText = () => {
        Share.share({
            message: 'Download Food Recipe App and enjoy your favourite recipes.',
            url: 'https://my-example-url.com',
            title: 'Food Recipe'
        }, {
            dialogTitle: 'Share App',

            tintColor: 'green'
        })
            .then()
            .catch((error) => alert(error));
    }

    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <Block flex style={styles.profile}>
                    <Block flex>
                        <ImageBackground
                            source={require('../assets/images/profileHeader.jpg')}
                            style={styles.profileContainer}
                            imageStyle={styles.profileImage}>
                            <Block flex style={styles.profileDetails}>
                                <Block style={styles.profileTexts}>
                                    <Text color="white" size={28} bold style={{paddingBottom: 8}}>{loggedIn.name}</Text>
                                </Block>
                                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={styles.gradient}/>
                            </Block>
                        </ImageBackground>
                    </Block>
                    <Block flex style={styles.options}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Block row space="between"
                                   style={{padding: theme.SIZES.BASE, marginHorizontal: theme.SIZES.BASE * 2}}>
                                <Text bold size={14}>Email.</Text>
                                <Text muted size={14} style={{marginBottom: 8}}>{loggedIn.email}</Text>
                            </Block>
                            <Block row space="around"
                                   style={{padding: theme.SIZES.BASE * 2, marginHorizontal: theme.SIZES.BASE * 2}}>
                                <Text bold size={14}>Share on social media</Text>
                            </Block>
                            <Block flex row space={"around"} style={{
                                marginHorizontal: theme.SIZES.BASE * 4,
                                paddingBottom: theme.SIZES.BASE * 4
                            }}>
                                <Button
                                    round
                                    onlyIcon
                                    shadowless
                                    icon="facebook"
                                    iconFamily="font-awesome"
                                    iconColor={theme.COLORS.WHITE}
                                    iconSize={theme.SIZES.BASE * 1.625}
                                    color={theme.COLORS.FACEBOOK}
                                    style={[styles.social, styles.shadow]}
                                    onPress={()=>shareText()}
                                />
                                <Button
                                    round
                                    onlyIcon
                                    shadowless
                                    icon="twitter"
                                    iconFamily="font-awesome"
                                    iconColor={theme.COLORS.WHITE}
                                    iconSize={theme.SIZES.BASE * 1.625}
                                    color={theme.COLORS.TWITTER}
                                    style={[styles.social, styles.shadow]}
                                    onPress={()=>shareText()}
                                />
                            </Block>

                            <Button shadowless color="error" style={[styles.button, styles.shadow]}
                                    onPress={() => {
                                        deleteUserData().then(() => {
                                            setLoggedin(undefined)
                                            Firebase.signOut().then(() => console.log("Logged out"))
                                        })
                                    }}>
                                Log Out
                            </Button>

                            <Block style={{height: 200}}>
                            </Block>
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
    social: {
        width: theme.SIZES.BASE * 3.5,
        height: theme.SIZES.BASE * 3.5,
        borderRadius: theme.SIZES.BASE * 1.75,
        justifyContent: 'center',
    },
    profileImage: {
        width: width * 1.1,
        height: 'auto',
    },
    profileContainer: {
        width: width,
        height: height / 2,
    },
    profileDetails: {
        paddingTop: theme.SIZES.BASE * 4,
        justifyContent: 'flex-end',
        position: 'relative',
    },
    profileTexts: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        paddingVertical: theme.SIZES.BASE * 7,
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
        marginHorizontal: 5,
        marginTop: -theme.SIZES.BASE * 7,
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
        height: '60%',
        position: 'absolute',
    },
});
