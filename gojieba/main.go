package main

import (

	// "syscall/js"

	// "syscall/js"

	"encoding/json"
	"strconv"
	"strings"
	"sync"
	"syscall/js"

	"github.com/wangbin/jiebago"
)

var x jiebago.Segmenter

func init() {
	x.LoadDictionary("777.txt")
}

func cut(this js.Value, args []js.Value) interface{} {
	resultChan := x.Cut(args[0].String(), false)
	result := []string{}
	for word := range resultChan {
		result = append(result, word)
	}
	resultStr, _ := json.Marshal(result)
	return js.ValueOf(string(resultStr))
}

func loadDictionary(this js.Value, args []js.Value) interface{} {
	dictStr := args[0].String()

	lines := strings.Split(dictStr, "\n")
	var fields []string
	var tmpStr string
	var tmpFreq float64
	// 每10000行数据启动一个数据并行
	totalLen := len(lines)
	gocount := totalLen / 10000
	wg := sync.WaitGroup{}
	for i := 0; i < gocount; i++ {
		wg.Add(1)
		go (func(lines []string, x *jiebago.Segmenter, wg *sync.WaitGroup) {
			for _, oneLine := range lines {
				fields = strings.Split(oneLine, " ")
				tmpStr = strings.TrimSpace(strings.Replace(fields[0], "\ufeff", "", 1))
				if length := len(fields); length > 1 {
					tmpFreq, _ = strconv.ParseFloat(fields[1], 64)
				}
				x.AddWord(tmpStr, tmpFreq)
			}
			wg.Done()
		})(lines[i*10000:(i+1)*10000], &x, &wg)
	}
	wg.Wait()
	return js.ValueOf(true)
}

func main() {
	done := make(chan int, 0)
	js.Global().Set("jiebaCut", js.FuncOf(cut))
	js.Global().Set("jiebaLoadDictionary", js.FuncOf(loadDictionary))
	<-done
	// result := []string{}
	// resultChan := x.CutAll("我住在武汉市长江大桥")
	// for word := range resultChan {
	// 	result = append(result, word)
	// }

	// resultChan = x.Cut("我住在上海市长江大桥", false)
	// for word := range resultChan {
	// 	result = append(result, word)
	// }

	// fmt.Println(result)
}
