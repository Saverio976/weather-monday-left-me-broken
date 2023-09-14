import { useState } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { MondayLeftMeBroken } from 'monday-left-me-broken'

import type {TextStyle, ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

/*
 * https://openweathermap.org/current#multi
    bg Bulgarian
    ca Catalan
    cz Czech
    da Danish
    de German
    el Greek
    en English
    eu Basque
    fa Persian (Farsi)
    fi Finnish
    fr French
    gl Galician
    he Hebrew
    hi Hindi
    hr Croatian
    hu Hungarian
    id Indonesian
    it Italian
    ja Japanese
    kr Korean
    la Latvian
    lt Lithuanian
    mk Macedonian
    no Norwegian
    nl Dutch
    pl Polish
    pt Portuguese
    pt_br Português Brasil
    ro Romanian
    ru Russian
    sv, se	Swedish
    sk Slovak
    sl Slovenian
    sp, es	Spanish
    sr Serbian
    th Thai
    tr Turkish
    ua, uk Ukrainian
    vi Vietnamese
    zh_cn Chinese Simplified
    zh_tw Chinese Traditional
    zu Zulu

 */
export type LangAvailable = 
    'af' | 'al' | 'ar' | 'az' | 'bg' | 'ca' | 'cz' | 'da' |
    'de' | 'el' | 'en' | 'eu' | 'fa' | 'fi' | 'fr' | 'gl' |
    'he' | 'hi' | 'hr' | 'hu' | 'id' | 'it' | 'ja' | 'kr' |
    'la' | 'lt' | 'mk' | 'no' | 'nl' | 'pl' | 'pt' | 'pt_br' |
    'ro' | 'ru' | 'sk' | 'sl' | 'sp' | 'sr' | 'th' | 'tr' | 'ua' | 'uk' |
    'vi' | 'zh_cn' | 'zh_tw' | 'zu'

/*
 * https://openweathermap.org/current#data
    standard
    metric
    imperial
 */
export type UnitsAvailable = 'standard' | 'metric' | 'imperial'

const styles = StyleSheet.create({
    container: {},
    containerTextInput: {
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        marginTop: 25,
        width: '90%',
        height: 50,
    },
    containerWeatherInfoStyle: {},
    icon: {
        width: '8%',
        aspectRatio: 1,
    },
    textInput: {
        fontSize: 20,
        fontFamily: 'Arial-BoldMT',
        width: '84%',
        paddingHorizontal: 10,
    },
    defaultWeatherText : {
        fontFamily: 'Arial',
        fontSize: 15,
        paddingTop: 10,
    },
    dataWeatherText : {
        fontFamily: 'Arial-BoldMT',
        fontSize: 15,
        paddingTop: 10,
    },
});

type WeatherApiResult = {
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    weather: {
        description: string;
    }[];
    wind: {
        speed: number;
    };
}

async function getWeatherF(city: string, appid: string, units: UnitsAvailable, lang: LangAvailable): Promise<WeatherApiResult | null> {
    const urlApi = "https://api.openweathermap.org/data/2.5/weather"
    const params = {
        q: city,
        appid: appid,
        units: units,
        lang: lang,
    }
    try {
        const response = await fetch(urlApi + '?' + new URLSearchParams(params), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return await response.json();
        }
        console.error('FETCH error weather' + response.status)
        return null
    } catch (error) {
        console.error(error);
        return null
    }
}

export type WeatherWidgetProps = {
    disableErrorView?: boolean,
    appid: string,
    units?: UnitsAvailable,
    lang?: LangAvailable,
    containerStyle?: ViewStyle,
    containerTextInputStyle?: ViewStyle,
    containerWeatherInfoStyle?: ViewStyle,
    textInputStyle?: TextStyle,
    defaultWeatherTextStyle?: TextStyle,
    dataWeatherTextStyle?: TextStyle,
    translation?: {
        temperature?: string
        temperatureFeelsLike?: string
        temperatureMin?: string
        temperatureMax?: string
        pressure?: string
        humidity?: string
        description?: string
        wind?: string,
        units?: string,
        tempUnits?: string,
        pressureUnits?: string,
    }
};

export const defaultWeatherWidgetProps = {
    disableErrorView: false,
    units: "metric",
    lang: "fr",
    containerStyle: styles.container,
    containerTextInputStyle: styles.containerTextInput,
    containerWeatherInfoStyle: styles.containerWeatherInfoStyle,
    textInputStyle: styles.textInput,
    defaultWeatherTextStyle: styles.defaultWeatherText,
    dataWeatherTextStyle: styles.dataWeatherText,
    translation: {
        temperature: "Température",
        temperatureFeelsLike: "Température ressentie",
        temperatureMin: "Température minimale",
        temperatureMax: "Température maximale",
        pressure: "Pression atmosphérique",
        humidity: "Humidité",
        description: "Description",
        wind: "Vent",
        units: "km/h",
        tempUnits: "°C",
        pressureUnits: "hPa",
    },
}

export default function Weather(props: WeatherWidgetProps): JSX.Element {
    const options = Object.assign({}, defaultWeatherWidgetProps, props);
    const [search, setSearch] = useState<string>('');
    const [result, setResult] = useState<WeatherApiResult | null>();
    const [error, setError] = useState<string>("");
    const [mondayLeftMeBroken, setMondayLeftMeBroken] = useState<boolean>(false);

    const getWeather = async (search_s: string) => {
        if (search_s.toLowerCase() === 'monday left me broken') {
            setMondayLeftMeBroken(true);
            return;
        }
        try {
            const response = await getWeatherF(search_s, options.appid, options.units, options.lang);
            setResult(response);
            setError("");
        } catch (error) {
            setResult(null);
            setError("The API is not responding or the city \ndoesn't exist.");
            console.log(error);
        }
    }

    const changeText = (value: string) => {
        setMondayLeftMeBroken(false);
        setSearch(value);
    }

    return (
        <View style={options.containerStyle}>
            <View style={options.containerTextInputStyle}>
                <TextInput
                    style={options.textInputStyle}
                    placeholder='Donnez une ville'
                    onChangeText={changeText}
                    onEndEditing={() => getWeather(search)}
                />
            </View>
            { mondayLeftMeBroken && <MondayLeftMeBroken /> }
            { result && result.main &&
                <View style={options.containerWeatherInfoStyle}>
                    <Text style={options.defaultWeatherTextStyle}>
                        Température : <Text style={options.dataWeatherTextStyle}> {result.main.temp}°C</Text>
                    </Text>
                    <Text style={options.defaultWeatherTextStyle}>
                        {options.translation.temperature} : <Text style={options.dataWeatherTextStyle}> {result.main.feels_like}{options.translation.tempUnits}</Text>
                    </Text>
                    <Text style={options.defaultWeatherTextStyle}>{options.translation.temperatureMin} :
                        <Text style={options.dataWeatherTextStyle}> {result.main.temp_min}{options.translation.tempUnits}</Text>
                    </Text>
                    <Text style={options.defaultWeatherTextStyle}>{options.translation.temperatureMin} :
                        <Text style={options.dataWeatherTextStyle}> {result.main.temp_max}{options.translation.tempUnits}</Text>
                    </Text>
                    <Text style={options.defaultWeatherTextStyle}>{options.translation.pressure} :
                        <Text style={options.dataWeatherTextStyle}> {result.main.pressure}{options.translation.pressureUnits}</Text>
                    </Text>
                    <Text style={options.defaultWeatherTextStyle}>{options.translation.humidity} :
                        <Text style={options.dataWeatherTextStyle}> {result.main.humidity}%</Text>
                    </Text>
                    <Text style={options.defaultWeatherTextStyle}>{options.translation.description} :
                        <Text style={options.dataWeatherTextStyle}> {result.weather[0].description}</Text>
                    </Text>
                    <Text style={options.defaultWeatherTextStyle}>{options.translation.wind} :
                        <Text style={options.dataWeatherTextStyle}> {result.wind.speed}{options.translation.units}</Text>
                    </Text>
                </View>
            }
            { error !== "" && !options.disableErrorView &&
                <View>
                    <Text style={options.defaultWeatherTextStyle}>{error}</Text>
                </View>
            }
        </View>
    );
}

