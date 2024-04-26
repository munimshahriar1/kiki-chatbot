import {Stack, router} from 'expo-router';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

import {useTheme} from '../../../themes';
import {useAuth} from '../../../contexts/authContext';
import {FIREBASE_AUTH} from '../../../firebase/firebaseConfig';

type FormData = {
  username:string;
  email: string;
  password: string;
  confirmpw: string;
};

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

function SignUpScreen(): React.JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmpw: '',
    },
  });

  const pwd = watch('password');

  const theme = useTheme();
  const [_, setAuth] = useAuth();

  const onSignUpPressed = async (data: FormData) => {
    //validate 
    setLoading(true);
    await createUserWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password)
      .then(userCredential => {
        // Signed up
        const user = userCredential.user;
        setAuth(user);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Alert.alert('Invalid credential');
      });
    setLoading(false);
  };

  /** 
   * Register with email / password
   * @param data
   */
  // const handleSubmit = async (data: FormData) => {
  //   setLoading(true);
  //   await createUserWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password)
  //     .then(userCredential => {
  //       // Signed up
  //       const user = userCredential.user;
  //       setAuth(user);
  //     })
  //     .catch(error => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // Alert.alert('Invalid credential');
  //     });
  //   setLoading(false);
  // };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Stack.Screen options={{headerShown: true, title: 'Sign Up'}} />
      <Text style={{
        margin: 20,
        fontSize:15,
      }} >Welcome! Please fill in your information.</Text>

      <Controller
        control={control}
        rules={{
          required: 'Username is required',
        }}
        render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
          <>
              <TextInput
                placeholder={'How you would like us call you'}
                onBlur={onBlur}
                secureTextEntry={true}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                style={[
                  styles.inputField,
                  {backgroundColor: theme.colors.foreground},
                ]}
              />
            {error && (
              <Text style = {{alignSelf: 'stretch' }}>{error.message || 'Error'}</Text>
            )}
          </>
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {value: EMAIL_REGEX, message: 'Email is invalid',
          },
        }}
        render={({field: {onChange, onBlur, value},fieldState: {error}}) => (
          <>
              <TextInput
                placeholder={'Your email address'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                style={[
                  styles.inputField,
                  {backgroundColor: theme.colors.foreground},
                ]}
              />
            {error && (
              <Text style = {{alignSelf: 'stretch' }}>{error.message || 'Error'}</Text>
            )}
          </>
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          required: 'Password is required',
          pattern: {
            value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
            message:'Password requirement: includes Uppercase, Lowercase, Number and 8 or more characters.'
          },
        }}
        render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
          <>
              <TextInput
                placeholder={'Password'}
                onBlur={onBlur}
                secureTextEntry={true}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                style={[
                  styles.inputField,
                  {backgroundColor: theme.colors.foreground},
                ]}
              />
            {error && (
              <Text style = {{alignSelf: 'stretch' }}>{error.message || 'Error'}</Text>
            )}
          </>
        )}
        name="password"
      />
      <Controller
        control={control}
        rules={{
          required: 'Confirm password is required',
          validate: value => value === pwd || 'Password does not match',
        }}
        render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
          <>
              <TextInput
                placeholder={'Confirm password'}
                onBlur={onBlur}
                secureTextEntry={true}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                style={[
                  styles.inputField,
                  {backgroundColor: theme.colors.foreground},
                ]}
              />
            {error && (
              <Text style = {{alignSelf: 'stretch' }}>{error.message || 'Error'}</Text>
            )}
          </>
        )}
        name="confirmpw"
      />
      {/* SignUp Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSignUpPressed)}
        style={[
          styles.signupButton,
          {
            backgroundColor: theme.colors.primary,
            opacity: 0.4,
          },
        ]}
        activeOpacity={0.8}>
        <View>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.foreground} />
          ) : (
            <Text style={{textAlign: 'center', color: 'white'}}>Sign Up</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    flexDirection: 'column',
    padding: 15,
    borderRadius: 8,
    rowGap: 10,
    width: '80%',
  },
  container: {
    flex: 1,
    gap: 25,
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: 'blue',
    padding: 15,
    width: '30%',
    borderRadius: 8,
  },
});

export default SignUpScreen;

// import {Stack, router} from 'expo-router';
// import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {useTheme} from '../../../themes';
// import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';

// function RegisterScreen({}) {
//   const theme = useTheme();
//   const [username, setUsername] = useState('');
//   const [usernameVerify, setUsernameVerify] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [passwordVerify, setPasswordVerify] = useState(false);
//   const [confirmPw, setConfirmPw] = useState('');
//   const auth = getAuth();

//   function handleName(e:any) {
//     const nameVar = e.nativeEvent.text;
//     setUsername(nameVar);
//     setUsernameVerify(false);

//     if(nameVar.length >1) {
//       setUsernameVerify(true);
//     }
//   }

//   function handlePassword(e:any){
//     const passwordVar = e.nativeEvent.text;
//     setPassword(passwordVar);
//     setPasswordVerify(false);

//     if(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(passwordVar)){
//       setPassword(passwordVar);
//       setPasswordVerify(true);
//     }
//   }

//   const handleSubmit = async (e:any) => {
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         const user = userCredential.user;
//         console.log(user.email);
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//       })
//   };

//   return (
//     <View
//     style={[styles.container, {backgroundColor: theme.colors.background}]}>
//       <Stack.Screen options={{title: 'Sign Up'}} />
//       <Text style={{
//         margin: 20,
//         fontSize:15
//       }} >Welcome! Please fill in your information.</Text>

//       <View style = {styles.inputContainer}>
//         <TextInput
//           placeholder ="How you want us call you"
//           value={ username }
//           onChange={e => handleName(e)}
//           style={[styles.input,
//             {backgroundColor: theme.colors.foreground},]}
//         />
//         <TextInput
//           placeholder ="Email address"
//           value={email}
//           onChangeText={text => setEmail(text)}
//           style={[styles.input,
//             {backgroundColor: theme.colors.foreground},]}
//         />
//         <TextInput
//           placeholder ="Password"
//           value={password}
//           onChange={e => handlePassword(e)}
//           style={[styles.input,
//             {backgroundColor: theme.colors.foreground},]}
//           secureTextEntry
//         />  
//         <TextInput
//           placeholder ="Confirm Password"
//           value={confirmPw }
//           onChangeText={text => setConfirmPw(text)}
//           style={[styles.input,
//             {backgroundColor: theme.colors.foreground},]}
//           secureTextEntry
//         />  
//       </View>
//       {username.length < 1 ? null: usernameVerify ? null :(
//         <Text
//           style = {{
//             marginLeft: 20,
//           }}>
//           Name should be more than 1 character.
//         </Text>
//       )}
//       {password.length < 1 ? null: passwordVerify ? null :(
//         <Text
//           style = {{
//             marginLeft: 20,
//           }}>
//           Password requirement: includes Uppercase, Lowercase, Number and 8 or more characters.
//         </Text>
//       )}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           onPress = {handleSubmit}
//           style = {[styles.regButton, 
//             {backgroundColor: theme.colors.primary, 
//             opacity: 0.4,},]}>
//           <Text style = {styles.buttonText}>Register</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// export default RegisterScreen

// const styles = StyleSheet.create({
//   container: {
//     flex:1,
//     gap: 20,
//   },
//   inputContainer: {
//     flex: 1,
//     gap: 20,
//     alignItems: 'center',
//   },
//   input: {
//     flexDirection: 'column',
//     padding: 15,
//     borderRadius: 8,
//     rowGap: 10,
//     width: '80%',
//   },
//   buttonContainer: {
//     alignItems: 'center',
//     marginBottom: 170,
//   },
//   regButton: {
//     backgroundColor: '#87cefa',
//     padding: 15,
//     width: '30%',
//     borderRadius: 8,
//   },
//   buttonText: {
//     textAlign: 'center', 
//     color: 'white',
//   },
// })

