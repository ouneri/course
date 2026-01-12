using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CMQuiz.Web.API.Models;

[JsonDerivedType(typeof(QuizItemRequestSelectModel), typeDiscriminator: "select")]
[JsonDerivedType(typeof(QuizItemRequestTextModel), typeDiscriminator: "text")]
[JsonDerivedType(typeof(QuizItemRequestRangeModel), typeDiscriminator: "range")]
[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
public abstract class QuizItemRequestModel
{
    [Required]
    [JsonPropertyName("type")]
    public abstract string Type { get; }
}

