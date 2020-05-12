import React, {useContext, useState} from "react";
import {Dimensions, ImageBackground, Platform, ScrollView, StyleSheet, TouchableOpacity, View, StatusBar} from "react-native";
import {Button} from "react-native-elements";
import {Ionicons} from "@expo/vector-icons";
import {Formik} from "formik";
import * as Yup from "yup";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import ErrorMessage from "../../components/ErrorMessage";
import {Firebase} from "../../connection/comms";
import UserContext from "../../connection/userContext"
import {Block, Text, theme} from "galio-framework";
import {LinearGradient} from "expo-linear-gradient";
import {HeaderHeight} from "../../constants/utils";
import materialTheme from "../../constants/materialTheme";

const {width, height} = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .label("Email")
        .email("Enter a valid email")
        .required("Please enter a registered email"),
    password: Yup.string()
        .label("Password")
        .required()
        .min(6, "Password must have at least 6 characters ")
});

function Login({navigation}) {
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState("ios-eye");
    const {loggedIn, setLoggedin} = useContext(UserContext);


    function goToSignup() {
        return navigation.navigate("Register");
    }

    function goToForgotPassword() {
        return navigation.navigate("Reset");
    }

    function handlePasswordVisibility() {
        if (rightIcon === "ios-eye") {
            setRightIcon("ios-eye-off");
            setPasswordVisibility(!passwordVisibility);
        } else if (rightIcon === "ios-eye-off") {
            setRightIcon("ios-eye");
            setPasswordVisibility(!passwordVisibility);
        }
    }


    async function handleOnLogin(values, actions) {
        const {email, password} = values;

        try {
            const response = await Firebase.loginWithEmail(email, password);
            if (response) {
                setLoggedin(response);
            }
        } catch (error) {
            actions.setFieldError("general", error.message);
        } finally {
            actions.setSubmitting(false);
        }
    }

    return (
        <Block flex style={styles.profile}>
            <StatusBar backgroundColor='white' barStyle='dark-content' />
            <Block flex>
                <ImageBackground
                    source={require('../../assets/images/loginImage.jpg')}
                    style={styles.profileContainer}
                    imageStyle={styles.profileImage}>
                    <Block flex style={styles.profileDetails}>
                        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={styles.gradient}/>
                    </Block>
                </ImageBackground>
            </Block>
            <Block flex style={styles.options}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text color="orange" h5 bold style={{paddingBottom: 10}}>Login 🔐</Text>
                    <Formik
                        initialValues={{email: "", password: ""}}
                        onSubmit={(values, actions) => {
                            handleOnLogin(values, actions);
                        }}
                        validationSchema={validationSchema}
                    >
                        {({
                              handleChange,
                              values,
                              handleSubmit,
                              errors,
                              isValid,
                              touched,
                              handleBlur,
                              isSubmitting
                          }) => (
                            <>
                                <FormInput
                                    name="email"
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    placeholder="Enter email"
                                    autoCapitalize="none"
                                    iconName="ios-mail"
                                    iconColor="#2C384A"
                                    onBlur={handleBlur("email")}
                                />
                                <ErrorMessage errorValue={touched.email && errors.email}/>
                                <FormInput
                                    name="password"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    placeholder="Enter password"
                                    secureTextEntry={passwordVisibility}
                                    iconName="ios-lock"
                                    iconColor="#2C384A"
                                    onBlur={handleBlur("password")}
                                    rightIcon={
                                        <TouchableOpacity onPress={handlePasswordVisibility}>
                                            <Ionicons name={rightIcon} size={28} color="grey"/>
                                        </TouchableOpacity>
                                    }
                                />
                                <ErrorMessage errorValue={touched.password && errors.password}/>
                                <View style={styles.buttonContainer}>
                                    <FormButton
                                        buttonType="outline"
                                        onPress={handleSubmit}
                                        title="LOGIN"
                                        buttonColor="#039BE5"
                                        disabled={!isValid || isSubmitting}
                                        loading={isSubmitting}
                                    />
                                </View>
                                <ErrorMessage errorValue={errors.general}/>
                            </>
                        )}
                    </Formik>
                    <Button
                        title="Don't have an account? Sign Up"
                        onPress={goToSignup}
                        titleStyle={{
                            color: "#F57C00"
                        }}
                        type="clear"
                    />
                    <Button
                        title="Forgot Password?"
                        onPress={goToForgotPassword}
                        titleStyle={{
                            color: "#039BE5"
                        }}
                        type="clear"
                    />

                    <Block style={{height: 200}}/>
                </ScrollView>
            </Block>
        </Block>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    logoContainer: {
        marginBottom: 15,
        alignItems: "center"
    },
    buttonContainer: {
        margin: 25
    },
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
        marginTop: -theme.SIZES.BASE * 20,
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

export default Login;
