import { Text, View } from "react-native";

const Home = () => {
    const minha_biblio = 'Minha Biblioteca';

    return (
        <View className="flex-1 items-center justify-center">
            <Text>{minha_biblio}</Text>
        </View>
    )
}

export default Home;