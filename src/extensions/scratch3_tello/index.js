const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');

const TelloProcessor = require('./telloProcessor');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';

const Message = {
    takeoff: {
        'ja': '離陸する',
        'ja-Hira': 'りりくする',
        'en': 'takeoff',
        'ru': 'взлёт',
        'fr': 'décollage',
        'de': 'abheben',
        'bg': 'излитане',
        'zh-tw': '起飛',
        'gu':'ઉપડવું',
        'hi':'उड़ान भरना'
    },
    land: {
        'ja': '着陸する',
        'ja-Hira': 'ちゃくりくする',
        'en': 'land',
        'ru': 'посадка',
        'fr': 'atterrissage',
        'de': 'landen',
        'bg': 'приземяване',
        'zh-tw': '降落',
        'gu':'લેન્ડ ',
        'hi':'लेंड,'
    },
    up: {
        'ja': '上に [X]cm 上がる',
        'ja-Hira': 'うえに [X] センチあがる',
        'en': 'up [X] cm',
        'ru': 'вверх [X] см',
        'fr': 'montée de [X] cm',
        'de': '[X] cm höher',
        'bg': 'издигане [X] см',
        'zh-tw': '向上 [X] 公分',
        'gu': 'ઉપર [X] સેમી',
        'hi': 'उपर [X] सेमी'
    },
    down: {
        'ja': '下に [X]cm 下がる',
        'ja-Hira': 'したに [X] センチさがる',
        'en': 'down [X] cm',
        'ru': 'вниз [X] см',
        'fr': 'descente de [X] cm',
        'de': '[X] cm tiefer',
        'bg': 'спускане [X] см',
        'zh-tw': '向下 [X] 公分',
        'gu': 'નીચે [X] સેમી',
        'hi': 'नीचे [X] सेमी'
    },
    left: {
        'ja': '左に [X]cm 動く',
        'ja-Hira': 'ひだりに [X] センチうごく',
        'en': 'move left [X] cm',
        'ru': 'влево [X] см',
        'fr': 'voler à gauche [X] cm',
        'de': '[X] cm nach links',
        'bg': 'наляво [X] см',
        'zh-tw': '向左 [X] 公分',
        'gu': 'ડાબે [X] સેમી',
        'hi': 'बाएं [X] सेमी'
    },
    right: {
        'ja': '右に [X]cm 動く',
        'ja-Hira': 'みぎに [X] センチうごく',
        'en': 'move right [X] cm',
        'ru': 'вправо [X] см',
        'fr': 'voler à droite [X] cm',
        'de': '[X] cm nach rechts',
        'bg': 'надясно [X] см',
        'zh-tw': '向右 [X] 公分',
        'gu': 'જમણે [X] સેમી',
        'hi': 'दाएँ [X] सेमी'
    },
    forward: {
        'ja': '前に [X]cm 進む',
        'ja-Hira': 'まえに [X] センチすすむ',
        'en': 'move forward [X] cm',
        'ru': 'вперёд [X] см',
        'fr': 'voler vers l\'avant [X] cm',
        'de': '[X] cm nach vorne',
        'bg': 'напред [X] см',
        'zh-tw': '前進 [X] 公分',
        'gu': 'આગળ વધો [X] સે.મી',
        'hi': 'आगे बढें [X] सेमी'
    },
    back: {
        'ja': '後ろに [X]cm 下がる',
        'ja-Hira': 'うしろに [X] センチさがる',
        'en': 'move back [X] cm',
        'ru': 'назад [X] см',
        'fr': 'voler vers l\'arrière [X] cm',
        'de': '[X] cm nach hinten',
        'bg': 'назад [X] см',
        'zh-tw': '後退 [X] 公分',
        'gu': 'પાછળ ખસેડો [X] સે.મી',
        'hi': 'पीछे जाएँ [X] सेमी'
    },
    cw: {
        'ja': '[X] 度右に回る',
        'ja-Hira': '[X] どみぎにまわる',
        'en': 'rotate [X] degrees right',
        'ru': 'повернуть на [X] градусов вправо',
        'fr': 'tourner de [X] degrés vers la droite',
        'de': 'drehe [X] Grad nach rechts',
        'bg': 'завъртане [X] градуса надясно',
        'zh-tw': '向右轉 [X] 度',
        'gu': '[X] ડિગ્રી જમણે ફેરવો',
        'hi': '[X] डिग्री दाईं ओर घुमाएं'
    },
    ccw: {
        'ja': '[X] 度左に回る',
        'ja-Hira': '[X] どひだりにまわる',
        'en': 'rotate [X] degrees left',
        'ru': 'повернуть на [X] градусов влево',
        'fr': 'tourner de [X] degrés vers la gauche',
        'de': 'drehe [X] Grad nach links',
        'bg': 'завъртане [X] градуса наляво',
        'zh-tw': '向左轉 [X] 度',
        'gu': '[X] ડિગ્રી ડાબે ફેરવો',
        'hi': '[X] डिग्री बायीं ओर घुमाएं'
    },
    flip: {
        'ja': '[DIRECTION]に宙返りする',
        'ja-Hira': '[DIRECTION]にちゅうがえりする',
        'en': 'flip in [DIRECTION]',
        'fr': 'flip vers [DIRECTION]',
        'de': 'Flip nach [DIRECTION]',
        'bg': 'лупинг на [DIRECTION]',
        'zh-tw': '向 [DIRECTION] 方翻轉',
        'gu': '[DIRECTION]માં ફ્લિપ કરો',
        'hi': 'फ्लिप करें [DIRECTION]'
    },
    go: {
        'ja': 'x:[X] y:[Y] z:[Z] に [SPEED]cm/s で飛ぶ',
        'ja-Hira': 'x:[X] y:[Y] z:[Z] に 1びょうで [SPEED] センチのはやさでとぶ',
        'en': 'fly to x:[X] y:[Y] z:[Z] in [SPEED]cm/s',
        'fr': 'voler à x:[X] y:[Y] z:[Z] à [SPEED]cm/s',
        'de': 'fliege zu x:[X] y:[Y] z:[Z] mit [SPEED]cm/s',
        'bg': 'лети до x:[X] y:[Y] z:[Z] с [SPEED] сm/сек',
        'zh-tw': '飛往 x:[X] y:[Y] z:[Z] 以速度 [SPEED] 公分/秒',
        'gu': 'x:[X] y:[Y] z:[Z] સુધી [SPEED]cm/s માં ઉડાન ભરો',
        'hi':'x:[X] y:[Y] z:[Z] तक [SPEED]cm/s में उड़ें'
    },
    curve: {
        'ja': 'x:[X1] y:[Y1] z:[Z1] から x:[X2] y:[Y2] z:[Z2] に [SPEED]cm/s でカーブしながら飛ぶ',
        'ja-hira': 'x:[X2] y:[Y2] z:[Z2] から x:[X2] y:[Y2] z:[Z2] に 1びょうで [SPEED] センチのはやさでカーブしながらとぶ',
        'en': 'fly in curve from x:[X1] y:[Y1] z:[Z1] to x:[X2] y:[Y2] z:[Z2] in [SPEED]cm/s',
        'fr': 'voler en courbe de x:[X1] y:[Y1] z:[Z1] à x:[X2] y:[Y2] z:[Z2] à [SPEED]cm/s',
        'de': 'fliege in einer Kurve von x:[X1] y:[Y1] z:[Z1] nach x:[X2] y:[Y2] z:[Z2] mit [SPEED]cm/s',
        'bg': 'лети от x:[X1] y:[Y1] z:[Z1] до x:[X2] y:[Y2] z:[Z2] с [SPEED] см/сек',
        'zh-tw': '曲線飛行從 x:[X1] y:[Y1] z:[Z1] 到 x:[X2] y:[Y2] z:[Z2] 以速度 [SPEED] 公分/秒',
        'gu':'x:[X1] y:[Y1] z:[Z1] થી x:[X2] y:[Y2] z:[Z2] [SPEED]cm/s માં વળાંકમાં ઉડાન ભરો',
        'hi':'x:[X1] y:[Y1] z:[Z1] से x:[X2] y:[Y2] z:[Z2] तक वक्र में [SPEED]cm/s में उड़ें'
    },
    enableMissionPad: {
        'ja': 'ミッションパッドを使う',
        'ja-Hira': 'ミッションパッドをつかう',
        'en': 'enable Mission Pad',
        'fr': 'activer le "Mission Pad"',
        'de': 'aktiviere das Mission Pad',
        'bg': 'активиране на Mission Pad',
        'zh-tw': '啟動挑戰卡',
        'gu': 'મિશન પેડ ઉપયોગ કરો',
        'hi': 'मिशन पैड सक्षम करें'
    },
    eduGo: {
        'ja': '[MID]を検出していたら、ミッションパッドを基準に x:[X] y:[Y] z:[Z] に [SPEED]cm/s で飛ぶ',
        'ja-Hira': '[MID]がみつかっていたら、ミッションパッドからみて x:[X] y:[Y] z:[Z] に 1びょうで [SPEED] センチのはやさでとぶ',
        'en': 'when [MID] detected, fly to x:[X] y:[Y] z:[Z] based on the Mission Pad at [SPEED]cm/s',
        'fr': 'détecter [MID], ensuite voler à x:[X] y:[Y] z:[Z] à partir du Mission Pad à [SPEED]cm/s',
        'de': 'wenn [MID] wahrgenommen wird, fliege nach x:[X] y:[Y] z:[Z] basierend auf dem Mission Pad mit [SPEED]cm/s',
        'bg': 'когато [MID] е засечен, лети от x:[X] y:[Y] z:[Z] според Mission Pad с [SPEED] см/сек',
        'zh-tw': '偵測到 [MID] 挑戰卡, 從挑戰卡飛行到 x:[X] y:[Y] z:[Z] 用 [SPEED]公分/秒 速度',
        'gu':'જ્યારે [MID] શોધાયું, ત્યારે [SPEED]cm/s પર મિશન પૅડ પર આધારિત x:[X] y:[Y] z:[Z] પર ઉડાન ભરો',
        'hi':'जब [MID] का पता चले, तो [SPEED]cm/s पर मिशन पैड के आधार पर x:[X] y:[Y] z:[Z] तक उड़ान भरें'
    },
    eduCurve: {
        'ja': '[MID]を検出していたら、ミッションパッドを基準に x:[X1] y:[Y1] z:[Z1] から x:[X2] y:[Y2] z:[Z2] に[SPEED]cm/s でカーブしながら飛ぶ',
        'ja-hira': '[MID]がみつかっていたら、ミッションパッドからみて x:[X2] y:[Y2] z:[Z2] から x:[X2] y:[Y2] z:[Z2] に 1びょうで [SPEED] センチのはやさでカーブしながらとぶ',
        'en': 'when [MID] detected, fly in curve from x:[X1] y:[Y1] z:[Z1] to x:[X2] y:[Y2] z:[Z2] based on the Mission Pad at [SPEED]cm/s',
        'fr': 'détecter [MID], ensuite voler en courbe de x:[X1] y:[Y1] z:[Z1] à x:[X2] y:[Y2] z:[Z2] à partir du Mission Pad à [SPEED] cm/s',
        'de': 'wenn [MID] wahrgenommen wird, fliege in einer Kurve von x:[X1] y:[Y1] z:[Z1] nach x:[X2] y:[Y2] z:[Z2] basierend auf dem Mission Pad mit [SPEED]cm/s',
        'bg': 'когато [MID] е засечен, лети със завой от x:[X1] y:[Y1] z:[Z1] до x:[X2] y:[Y2] z:[Z2] според Mission Pad с [SPEED] см/сек',
        'zh-tw': '偵測到 [MID] 挑戰卡, 以弧線飛行從 x:[X1] y:[Y1] z:[Z1] 到 x:[X2] y:[Y2] z:[Z2] 用 [SPEED]公分/秒 速度',
        'gu':'જ્યારે [MID] શોધાય છે, ત્યારે [SPEED] પર મિશન પૅડ પર આધારિત x:[X1] y:[Y1] z:[Z1] થી x:[X2] y:[Y2] z:[Z2] વળાંકમાં ઉડાન ભરો cm/s',
        'hi':'जब [MID] का पता चले, तो मिशन पैड के आधार पर [SPEED]cm/s पर x:[X1] y:[Y1] z:[Z1] से x:[X2] y:[Y2] z:[Z2] तक वक्र में उड़ान भरें'
    },
    eduJump: {
        'ja': '[MID1]と[MID2]を検出していたら、1つ目のミッションパッドを基準に x:[X] y:[Y] z:[Z] に飛んだあと、2つ目のミッションパッドの上まで[SPEED]cm/sで飛び[YAW]度に向く',
        'ja-hira': '[MID1]と[MID2]がみつかったら、1つめのミッションパッドからみて x:[X] y:[Y] z:[Z] にとんだあと2つめのミッションパッドのうえまで 1びょうで [SPEED] センチのはやさでとび、[YAW]どにむく',
        'en': 'when [MID1] [MID2] detected, fly to x:[X] y:[Y] z:[Z] based on first mission pad then fly on second mission pad at [SPEED] cm/s and rotate [YAW] degrees',
        'fr': 'détecter [MID1] et [MID2], ensuite voler à x:[X] y:[Y] z:[Z] à partir du premier Mission Pad, faire une rotation de [YAW] degrés, et voler au deuxième Mission Pad à [SPEED] cm/s',
        'de': 'wenn [MID1] [MID2] wahrgenommen wird, fliege nach x:[X] y:[Y] z:[Z] basierend auf dem ersten Mission Pad, fliege dann zum zweiten Mission Pad mit [SPEED] cm/s und drehe dich um [YAW] Grad',
        'bg': 'когато [MID1] [MID2] е засечен, лети до x:[X] y:[Y] z:[Z] според първи Mission Pad, след това според втори Mission Pad с [SPEED] см/сек и се завърти [YAW] градуса',
        'zh-tw': '偵測到 [MID1] [MID2] , 從第一個挑戰卡用 [SPEED] 公分/秒 速度及旋轉 [YAW] 角度飛往 x:[X] y:[Y] z:[Z] 第二個挑戰卡',
        'gu': 'જ્યારે [MID1] [MID2] શોધાય છે, ત્યારે પ્રથમ મિશન પેડ પર આધારિત x:[X] y:[Y] z:[Z] પર ફ્લાય કરો પછી બીજા મિશન પેડ પર [SPEED] cm/s પર ઉડાન ભરો અને [YAW] ડિગ્રી ફેરવો',
        'hi': 'जब [MID1] [MID2] का पता चले, तो पहले मिशन पैड के आधार पर x:[X] y:[Y] z:[Z] पर उड़ान भरें, फिर [SPEED] cm/s पर दूसरे मिशन पैड पर उड़ान भरें और [YAW] डिग्री घुमाएँ'
    },
    clearQueue: {
        'ja': '実行待ちのコマンドをクリアする',
        'ja-Hira': 'うごくのをまっているコマンドをなくす',
        'en': 'clear command queue',
        'fr': 'effacer la séquence de commandes',
        'de': 'lösche die Befehlsreihe',
        'bg': 'изтриване на командите',
        'zh-tw': '清除命令佇列',
        'gu': 'આદેશ કતાર સાફ કરો',
        'hi': 'आदेश कतार साफ़ करें'
    },
    pitch: {
        'ja': 'ピッチ',
        'ja-Hira': 'ピッチ',
        'en': 'pitch',
        'ru': 'наклон',
        'fr': 'tangage',
        'de': 'falle',
        'bg': 'накланяне',
        'zh-tw': '俯仰',
        'gu': 'પિચ',
        'hi': 'पिच'
    },
    roll: {
        'ja': 'ロール',
        'ja-Hira': 'ロール',
        'en': 'roll',
        'ru': 'крен',
        'fr': 'roulis',
        'de': 'rolle',
        'bg': 'завъртане',
        'zh-tw': '翻滾',
        'gu': 'રોલ',
        'hi': 'रोल'
    },
    yaw: {
        'ja': 'ヨー',
        'ja-Hira': 'ヨー',
        'en': 'yaw',
        'ru': 'вращение вокруг оси Z',
        'fr': 'lacet',
        'de': 'schwanken',
        'bg': 'завъртане',
        'zh-tw': '偏擺',
        'gu':'યો',
        'hi':'यो'
    },
    vgx: {
        'ja': 'x方向の速度',
        'ja-Hira': 'xほうこうのはやさ',
        'en': 'speed x',
        'ru': 'скорость x',
        'fr': 'vitesse sur l\'axe X',
        'de': 'Geschwindigkeit x',
        'bg': 'скорост x',
        'zh-tw': 'x方向的速度',
        'gu': 'ઝડપ x',
        'hi':'गति x'
    },
    vgy: {
        'ja': 'y方向の速度',
        'ja-Hira': 'yほうこうのはやさ',
        'en': 'speed y',
        'ru': 'скорость y',
        'fr': 'vitesse sur l\'axe Y',
        'de': 'Geschwindigkeit y',
        'bg': 'скорост y',
        'zh-tw': 'y方向的速度',
        'gu': 'ઝડપ y',
        'hi':'गति y'
    },
    vgz: {
        'ja': 'z方向の速度',
        'ja-Hira': 'zほうこうのはやさ',
        'en': 'speed z',
        'ru': 'скорость z',
        'fr': 'vitesse sur l\'axe Z',
        'de': 'Geschwindigkeit z',
        'bg': 'скорост z',
        'zh-tw': 'z方向的速度',
        'gu': 'ઝડપ z',
        'hi':'गति z'
    },
    tof: {
        'ja': '地面からの高度',
        'ja-Hira': 'じめんからのたかさ',
        'en': 'height from ground',
        'ru': 'высота от земли',
        'fr': 'hauteur du sol',
        'de': 'Höhe vom Boden',
        'bg': 'височина от земята',
        'zh-tw': '距離地面高度',
        'gu':'જમીનથી ઊંચાઈ',
        'hi':'ज़मीन से ऊंचाई'
    },
    height: {
        'ja': '離陸した場所からの高度',
        'ja-Hira': 'りりくしたばしょからのたかさ',
        'en': 'height from takeoff point',
        'ru': 'высота от точки взлёта',
        'fr': 'hauteur du point de décollage',
        'de': 'Höhe vom Startpunkt',
        'bg': 'височина от точката на излитане',
        'zh-tw': '距離起飛點的高度',
        'gu':'ટેકઓફ પોઈન્ટથી ઊંચાઈ',
        'hi':'टेकऑफ़ बिंदु से ऊंचाई'
    },
    bat: {
        'ja': 'バッテリー残量',
        'ja-Hira': 'バッテリーざんりょう',
        'en': 'battery remaining',
        'ru': 'заряд батареи',
        'fr': 'niveau de la batterie',
        'de': 'übrige Batterieladung',
        'bg': 'заряд на батерията',
        'zh-tw': '剩餘電量',
        'gu':'બેટરી બાકી',
        'hi':'शेष बैटरी'
    },
    baro: {
        'ja': '気圧計による高さ',
        'ja-Hira': 'きあつけいによるたかさ',
        'en': 'height by barometer',
        'ru': 'высота по барометру',
        'fr': 'altitude (baromètre)',
        'de': 'Höhe gemessen am Luftdruck',
        'bg': 'височина според барометър',
        'zh-tw': '氣壓計偵測高度',
        'gu':'બેરોમીટર દ્વારા ઊંચાઈ',
        'hi':'बैरोमीटर से ऊंचाई'
    },
    time: {
        'ja': '飛行時間',
        'ja-Hira': 'ひこうじかん',
        'en': 'flying time',
        'ru': 'время полёта',
        'fr': 'durée du vol',
        'de': 'Flugzeit',
        'bg': 'време на полета',
        'zh-tw': '飛行時間',
        'gu':'ઉડવાનો સમય',
        'hi':'उडान का समय'
    },
    agx: {
        'ja': 'x方向の加速度',
        'ja-Hira': 'xほうこうのかそくど',
        'en': 'acceleration x',
        'ru': 'ускорение x',
        'fr': 'accélération sur l\'axe X',
        'de': 'Beschleunigung x',
        'bg': 'ускорение x',
        'zh-tw': 'x方向的加速度',
        'gu':'પ્રવેગક x',
        'hi':'त्वरण x'
    },
    agy: {
        'ja': 'y方向の加速度',
        'ja-Hira': 'yほうこうのかそくど',
        'en': 'acceleration y',
        'ru': 'ускорение y',
        'fr': 'accélération sur l\'axe Y',
        'de': 'Beschleunigung y',
        'bg': 'ускорение y',
        'zh-tw': 'y方向的加速度',
        'gu':'પ્રવેગક y',
        'hi':'त्वरण y'
    },
    agz: {
        'ja': 'z方向の加速度',
        'ja-Hira': 'zほうこうのかそくど',
        'en': 'acceleration z',
        'ru': 'ускорение z',
        'fr': 'accélération sur l\'axe Z',
        'de': 'Beschleunigung z',
        'bg': 'ускорение z',
        'zh-tw': 'z方向的加速度',
        'gu':'પ્રવેગક z',
        'hi':'त्वरण z'
    },
    left1: {
        'ja': '左',
        'ja-Hira': 'ひだり',
        'en': 'left',
        'fr': 'gauche',
        'de': 'links',
        'bg': 'наляво',
        'zh-tw': '左',
        'it' : 'sinistra',
        'lv': 'pa kreisi',
        'ua': 'ліворуч',
        'gu': 'ડાબી બાજુ',
        'hi': 'बाएं '
    },
    right1: {
        'ja': '右',
        'ja-Hira': 'みぎ',
        'en': 'right',
        'fr': 'droite',
        'de': 'rechts',
        'bg': 'надясно',
        'zh-tw': '右',
        'it' : 'destra',
        'lv': 'pa labi',
        'ua': 'праворуч',
        'gu': 'જમણી બાજુ',
        'hi': 'दाएँ '
    },
    forward1: {
        'ja': '前',
        'ja-Hira': 'まえ',
        'en': 'forward',
        'fr': 'avant',
        'de': 'vorwärts',
        'bg': 'напред',
        'zh-tw': '前',
        'it' : 'avanti',
        'lv': 'uz priekšu',
        'ua': 'вперед',
        'gu': 'આગળ વધો ',
        'hi': 'आगे बढें '
    },
    back1: {
        'ja': '後ろ',
        'ja-Hira': 'うしろ',
        'en': ' back ',
        'fr': 'arrière',
        'de': 'zurück',
        'bg': 'назад',
        'zh-tw': '後',
        'it' : 'indietro',
        'lv': 'atpakaļ',
        'ua': 'назад',
        'gu':'પાછળ ખસેડો',
        'hi':'पीछे जाएँ'
    },
    random:{
        'ja': 'ランダム',
        'ja-Hira': 'ランダム',
        'en': 'random',
        'fr': 'aléatoire',
        'de': 'beliebig',
        'bg': 'случаен',
        'zh-tw': '亂數',
        'it' : 'casuale',
        'lv': 'nejaušs',
        'ua': 'випадковий',
        'gu':'આડુંઅવળું',
        'hi':'यादृच्छिक'
    },
    nearest:{
        'ja': '最も近い',
        'ja-Hira': 'もっともちかい',
        'en': 'nearest',
        'fr': 'le plus proche',
        'de': 'am nahesten',
        'bg': 'най-близък',
        'zh-tw': '最近的',
        'it' : 'il più vicino',
        'lv': 'tuvākais',
        'ua': 'найближчий',
        'gu':'નજીકના',
        'hi':'सबसे नजदीक'
    }
    
};

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn','gu','hi'];

/**
 * Class for the Tello
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3Tello {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.locale = this.setLocale();

        this.telloProcessor = new TelloProcessor();
        this.telloProcessor.initialize();

        this.state = {};
        this.getState();
    }


    

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        this.locale = this.setLocale();
        return {
            id: 'tello',
            name: 'Tello',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'takeoff',
                    text: Message.takeoff[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'land',
                    text: Message.land[this.locale],
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'up',
                    text: Message.up[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'down',
                    text: Message.down[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'left',
                    text: Message.left[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'right',
                    text: Message.right[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'forward',
                    text: Message.forward[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'back',
                    text:Message.back[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'cw',
                    text: Message.cw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'ccw',
                    text:Message.ccw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'flip',
                    text: Message.flip[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'f',
                            menu: 'DIRECTION'
                        }
                    }
                },
                '---',
                {
                    opcode: 'go',
                    text: Message.go[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                    }
                },
                {
                    opcode: 'curve',
                    text: Message.curve[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        X2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                '---',
                {
                    opcode: 'enableMissionPad',
                    text: Message.enableMissionPad[this.locale],
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'eduGo',
                    text: '(EDU) ' + Message.eduGo[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        MID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'm1',
                            menu: 'MID'
                        }
                    }
                },
                {
                    opcode: 'eduCurve',
                    text: '(EDU) ' + Message.eduCurve[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        X2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        MID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'm1',
                            menu: 'MID'
                        }
                    }
                },
                {
                    opcode: 'eduJump',
                    text: '(EDU) ' + Message.eduJump[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        YAW: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MID1: {
                            type: ArgumentType.STRING,
                            defaultValue: 'm1',
                            menu: 'MID'
                        },
                        MID2: {
                            type: ArgumentType.STRING,
                            defaultValue: 'm1',
                            menu: 'MID'
                        }
                    }
                },
                '---',
                {
                    opcode: 'clearQueue',
                    text: Message.clearQueue[this.locale],
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'pitch',
                    text: Message.pitch[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'roll',
                    text: Message.roll[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'yaw',
                    text: Message.yaw[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgx',
                    text: Message.vgx[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgy',
                    text:Message.vgy[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgz',
                    text: Message.vgz[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'tof',
                    text:Message.tof[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'height',
                    text:Message.height[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'bat',
                    text: Message.bat[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'baro',
                    text:Message.baro[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'time',
                    text: Message.time[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agx',
                    text: Message.agx[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agy',
                    text: Message.agy[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agz',
                    text: Message.agz[this.locale],
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
                DIRECTION: {
                    acceptReporters: true,
                    items: [
                        {
                            text: Message.forward1[this.locale],
                            value: 'f'
                        },
                        {
                            text: Message.back1[this.locale],
                            value: 'b'
                        },
                        {
                            text: Message.left1[this.locale],
                            value: 'l'
                        },
                        {
                            text: Message.right1[this.locale],
                            value: 'r'
                        }
                    ]
                },
                MID: {
                    acceptReporters: true,
                    items: [
                        {
                            text: 'm1',
                            value: 'm1'
                        },
                        {
                            text: 'm2',
                            value: 'm2'
                        },
                        {
                            text: 'm3',
                            value: 'm3'
                        },
                        {
                            text: 'm4',
                            value: 'm4'
                        },
                        {
                            text: 'm5',
                            value: 'm5'
                        },
                        {
                            text: 'm6',
                            value: 'm6'
                        },
                        {
                            text: 'm7',
                            value: 'm7'
                        },
                        {
                            text: 'm8',
                            value: 'm8'
                        },
                        {
                            text: Message.random[this.locale],
                            value: 'm-1'
                        },
                        {
                            text: Message.nearest[this.locale],
                            value: 'm-2'
                        }
                    ]
                }
            }
        };
    }

    getState () {
        setInterval(() => {
            const state = this.telloProcessor.state();
            this.state = state;
        }, 100);
    }

    takeoff () {
        this.telloProcessor.request('takeoff');
    }

    land () {
        this.telloProcessor.request('land');
    }

    up (args) {
        this.telloProcessor.request(`up ${Cast.toString(args.X)}`);
    }

    down (args) {
        this.telloProcessor.request(`down ${Cast.toString(args.X)}`);
    }

    left (args) {
        this.telloProcessor.request(`left ${Cast.toString(args.X)}`);
    }

    right (args) {
        this.telloProcessor.request(`right ${Cast.toString(args.X)}`);
    }

    forward (args) {
        this.telloProcessor.request(`forward ${Cast.toString(args.X)}`);
    }

    back (args) {
        this.telloProcessor.request(`back ${Cast.toString(args.X)}`);
    }

    cw (args) {
        this.telloProcessor.request(`cw ${Cast.toString(args.X)}`);
    }

    ccw (args) {
        this.telloProcessor.request(`ccw ${Cast.toString(args.X)}`);
    }

    flip (args) {
        this.telloProcessor.request(`flip ${args.DIRECTION}`);
    }

    go (args) {
        this.telloProcessor.request(`go ${Cast.toString(args.X)} ${Cast.toString(args.Y)} ${Cast.toString(args.Z)} ${Cast.toString(args.SPEED)}`);
    }

    curve (args) {
        this.telloProcessor.request(`curve ${Cast.toString(args.X1)} ${Cast.toString(args.Y1)} ${Cast.toString(args.Z1)} ${Cast.toString(args.X2)} ${Cast.toString(args.Y2)} ${Cast.toString(args.Z2)} ${Cast.toString(args.SPEED)}`);
    }

    enableMissionPad () {
        this.telloProcessor.request(`mon`);
        this.telloProcessor.request(`mdirection 2`);
    }

    eduGo (args) {
        this.telloProcessor.request(`go ${Cast.toString(args.X)} ${Cast.toString(args.Y)} ${Cast.toString(args.Z)} ${Cast.toString(args.SPEED)} ${args.MID}`);
    }

    eduCurve (args) {
        this.telloProcessor.request(`curve ${Cast.toString(args.X1)} ${Cast.toString(args.Y1)} ${Cast.toString(args.Z1)} ${Cast.toString(args.X2)} ${Cast.toString(args.Y2)} ${Cast.toString(args.Z2)} ${Cast.toString(args.SPEED)} ${args.MID}`);
    }

    eduJump (args) {
        this.telloProcessor.request(`jump ${Cast.toString(args.X)} ${Cast.toString(args.Y)} ${Cast.toString(args.Z)} ${Cast.toString(args.SPEED)} ${Cast.toString(args.YAW)} ${args.MID1} ${args.MID2}`);
    }

    clearQueue () {
        this.telloProcessor.resetQueue();
    }

    pitch () {
        return this.state.pitch;
    }

    roll () {
        return this.state.roll;
    }

    yaw () {
        return this.state.yaw;
    }

    vgx () {
        return this.state.vgx;
    }

    vgy () {
        return this.state.vgy;
    }

    vgz () {
        return this.state.vgz;
    }

    tof () {
        return this.state.tof;
    }

    height () {
        return this.state.h;
    }

    bat () {
        return this.state.bat;
    }

    baro () {
        return this.state.baro;
    }

    time () {
        return this.state.time;
    }

    agx () {
        return this.state.agx;
    }

    agy () {
        return this.state.agy;
    }

    agz () {
        return this.state.agz;
    }

    setLocale() {
        let locale = formatMessage.setup().locale;
        if (AvailableLocales.includes(locale)) {
          return locale;
        } else {
          return 'en';
        }
      }
}
module.exports = Scratch3Tello;