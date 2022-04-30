export default class StringUtils {
    /**
     * Transforma a string no formato de título.
     * Ex. 1: StringUtils.title("eu sou a lenda")   => "Eu Sou A Lenda"
     * Ex. 2: StringUtils.title("ERA UMA VEZ")      => "Era Uma Vez"
     */
    static title(string: String) {
        return string.toLowerCase().replace(/(^|\s)./g, ch => ch.toUpperCase());
    }

    /**
     * Obtem a primeira palavra da string.
     * Ex. 1: StringUtils.firstWord("eu sou a lenda")   => "eu"
     * Ex. 2: StringUtils.firstWord("ERA UMA VEZ")      => "ERA"
     * Ex. 2: StringUtils.firstWord("   Bird Box")      => "Bird"
     */
    static firstWord(string: String) {
        return string.trim().split(' ', 1)[0];
    }
}